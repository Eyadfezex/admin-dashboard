import grapghqlDataProvider, {
  GraphQLClient,
  liveProvider as graphqlLiveProvider,
} from "@refinedev/nestjs-query"; // Importing data provider and GraphQL client utilities from refine's nestjs-query package.
import { fetchWrapper } from "./fetch-wrapper"; // Importing the custom fetch wrapper for handling HTTP requests.
import { Client, createClient } from "graphql-ws"; // Importing the WebSocket client for handling real-time GraphQL subscriptions.

export const API_BASE_URL = "https://api.crm.refine.dev"; // Base URL for the API.
export const API_URL = `${API_BASE_URL}/graphql`; // graphQL URL for the API.
export const WS_URL = "wss://api.crm.refine.dev/graphql"; // WebSocket URL for GraphQL subscriptions.

export const client = new GraphQLClient(API_URL, {
  /**
   * Custom fetch function for the GraphQL client.
   *
   * This function wraps the `fetchWrapper` to handle GraphQL requests with custom error handling.
   * @param {string} url - The URL for the fetch request.
   * @param {RequestInit} options - Request options including headers, method, and body.
   * @returns {Promise<Response>} - The fetch response or a rejected promise if an error occurs.
   */
  fetch: (url, options: RequestInit = {}) => {
    try {
      // Use the fetchWrapper for handling requests with additional error handling.
      return fetchWrapper(url.toString(), options);
    } catch (error) {
      // Reject the promise with the error if something goes wrong.
      return Promise.reject(error as Error);
    }
  },
});

export const wsClient =
  typeof window !== "undefined"
    ? (createClient({
        url: WS_URL, // WebSocket URL for real-time communication.
        /**
         * Connection parameters for the WebSocket client.
         * Includes the Authorization header with the access token from localStorage.
         */
        connectionParams: () => {
          const accessToken = localStorage.getItem("access_token"); // Retrieve the access token from localStorage.
          return {
            headers: {
              Authorization: `Bearer ${accessToken}`, // Include the token in the Authorization header.
            },
          };
        },
      }) as Client)
    : undefined; // If not running in a browser environment, set wsClient to undefined.

/**
 * GraphQL data provider using the configured GraphQL client.
 *
 * This provider is used for performing CRUD operations (e.g., queries and mutations) through GraphQL.
 */
export const dataProvider = grapghqlDataProvider(client);

/**
 * Live provider for handling real-time updates via WebSocket.
 *
 * This provider is used for subscriptions to GraphQL events in real-time. If WebSocket is unavailable,
 * it falls back to `undefined`.
 */
export const liveProvider = wsClient
  ? graphqlLiveProvider(wsClient) // Use the WebSocket client if available.
  : undefined; // If WebSocket is not available, set liveProvider to undefined.
