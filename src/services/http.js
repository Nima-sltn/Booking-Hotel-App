import axios from "axios";
import { API_BASE_URL } from "../config/env";

/**
 * Shared axios client for the JSON Server API.
 * Applies the base URL, a request timeout and normalizes error messages
 * so callers (context providers, hooks) never deal with raw axios errors.
 * @module services/http
 */
const http = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10_000,
});

http.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server answered with a 4xx/5xx status.
      error.message =
        error.response.data?.message ??
        `Request failed (${error.response.status})`;
    } else if (error.code === "ECONNABORTED") {
      error.message = "Request timed out, please try again";
    } else if (!axios.isCancel(error)) {
      error.message = "Cannot reach the server, is it running?";
    }
    return Promise.reject(error);
  },
);

export default http;
