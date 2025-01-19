import type { GraphQLFormattedError } from "graphql";

/**
 * Represents a custom error object with a message and a status code.
 */
type Error = {
  message: string;
  statusCode: string;
};

/**
 * Custom fetch function that includes authentication headers and additional metadata.
 * @param url - The URL to send the request to.
 * @param options - The request options, such as method, headers, and body.
 * @returns A Promise resolving to the Fetch API response.
 */
const customFetch = async (url: string, options: RequestInit) => {
  const accessToken = localStorage.getItem("access_token");
  const headers = options.headers as Record<string, string>;

  return await fetch(url, {
    ...options,
    headers: {
      ...headers,
      Authorization: headers?.Authorization || `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      "Apollo-Require-Preflight": "true",
    },
  });
};

/**
 * A wrapper function for making HTTP requests, handling custom fetch logic and error parsing.
 * @param url - The URL to send the request to.
 * @param options - The request options, such as method, headers, and body.
 * @returns A Promise resolving to the Fetch API response.
 * @throws An error object if the response contains GraphQL errors.
 */
export const fetchWrapper = async (url: string, options: RequestInit) => {
  const response = await customFetch(url, options);

  // Clone the response to allow reading its body multiple times.
  const responseClone = response.clone();
  const body = await responseClone.json();

  // Parse GraphQL errors from the response body.
  const error = getGraphQLErrors(body);

  if (error) {
    throw error;
  }

  return response;
};

/**
 * Extracts GraphQL-formatted errors from the response body.
 * @param body - The response body containing potential GraphQL errors.
 * @returns An Error object if errors exist, or null if none are found.
 */
const getGraphQLErrors = (
  body: Record<"errors", GraphQLFormattedError[] | undefined>
): Error | null => {
  if (!body) {
    return {
      message: "Unknown error",
      statusCode: "INTERNAL_SERVER_ERROR",
    };
  }

  if ("errors" in body) {
    const errors = body?.errors;
    const messages = errors?.map((error) => error?.message)?.join("");
    const code = errors?.[0]?.extensions?.code;

    return {
      message: messages || JSON.stringify(errors),
      statusCode: code?.toString() || "500",
    };
  }

  return null;
};
