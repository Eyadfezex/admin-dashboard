import { GraphQLFormattedError } from "graphql"; // Importing the type for GraphQL-formatted errors.

type Error = {
  message: string; // The error message.
  statusCode: string; // The error status code.
};

/**
 * A custom wrapper around the fetch API to simplify authenticated HTTP requests.
 *
 * @param {string} url - The URL to which the request is sent.
 * @param {RequestInit} options - The options for the fetch request, including method, headers, and body.
 * @returns {Promise<Response>} - The response from the fetch request.
 */
const customFetch = async (
  url: string,
  options: RequestInit
): Promise<Response> => {
  // Retrieve the access token from localStorage.
  const accessToken = localStorage.getItem("access_token");

  // Cast the headers from the options object to a Record<string, string>.
  const headers = options.headers as Record<string, string>;

  // Perform the fetch request with additional headers for authentication and content type.
  return await fetch(url, {
    ...options, // Spread the provided options.
    headers: {
      ...headers, // Include any headers passed in options.
      Authorization: headers?.Authorization || `Bearer ${accessToken}`, // Use provided Authorization header or add a Bearer token.
      "Content-Type": "application/json", // Ensure the content type is JSON.
      "Apollo-Required-Preflight": "true", // Add a header required by Apollo GraphQL for preflight checks.
    },
  });
};

/**
 * Extracts and formats GraphQL errors from a response body.
 *
 * @param {Record<"error", GraphQLFormattedError[] | undefined>} body - The response body containing an error field.
 * @returns {Error | null} - A formatted error object or null if no error is found.
 */
const getGraphQLErrors = (
  body: Record<"error", GraphQLFormattedError[] | undefined>
): Error | null => {
  // If the response body does not contain an error field, return a default error object.
  if (!body.error) {
    return {
      message: "No error found in response", // Default error message.
      statusCode: "INTERNAL_SERVER_ERROR", // Default status code.
    };
  }

  // If the response body contains an "error" field, process the errors.
  if ("error" in body) {
    const errors = body?.error; // Array of GraphQLFormattedError objects.

    // Combine all error messages into a single string.
    const messages = errors?.map((error) => error.message).join("");

    // Extract the error code from the first error object, if available.
    const code = errors?.[0]?.extensions?.code;

    return {
      message: messages || JSON.stringify(errors), // Use messages or fallback to a stringified error object.
      statusCode: code ? String(code) : "500", // Use the extracted code or default to "500".
    };
  }

  // Return null if no errors are found.
  return null;
};

/**
 * A wrapper around `customFetch` to handle GraphQL errors in the response.
 *
 * This function performs the following:
 * - Sends an HTTP request using `customFetch`.
 * - Clones the response to safely read its body.
 * - Parses the response body as JSON to check for GraphQL errors.
 * - Uses `getGraphQLErrors` to detect and format errors in the response body.
 * - Throws an error if GraphQL errors are found; otherwise, returns the original response.
 *
 * @param {string} url - The URL to which the request is sent.
 * @param {RequestInit} options - The options for the fetch request, including method, headers, and body.
 * @returns {Promise<Response>} - The original response from the fetch request, if no errors are detected.
 * @throws {Error} - Throws a formatted error if GraphQL errors are found in the response body.
 */
export const fetchWrapper = async (
  url: string,
  options: RequestInit
): Promise<Response> => {
  // Perform the fetch request using the customFetch function.
  const response = await customFetch(url, options);

  // Clone the response to safely read its body without consuming it.
  const responsClone = response.clone();

  // Parse the cloned response body as JSON.
  const body = await responsClone.json();

  // Use getGraphQLErrors to detect and format any GraphQL errors in the response body.
  const error = getGraphQLErrors(body);

  // If an error is detected, throw it.
  if (error) {
    throw error;
  }

  // If no errors are found, return the original response.
  return response;
};
