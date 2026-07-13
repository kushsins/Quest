import axios, { type AxiosError } from "axios";

import { ApiClientError, type ApiErrorResponse } from "@/shared/api/types";
import { notifySessionExpired } from "@/shared/auth/authSession";
import { setupAuthInterceptors } from "@/shared/api/setupAuthInterceptors";

const baseURL = import.meta.env.VITE_API_BASE_URL;

if (!baseURL) {
  throw new Error("VITE_API_BASE_URL is not defined.");
}

export const apiClient = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiErrorResponse>) => {
    const errorData = error.response?.data;

    if (errorData) {
      throw new ApiClientError(
        error.response?.status ?? 500,
        errorData.message,
        errorData.errors,
      );
    }

    throw new ApiClientError(
      error.response?.status ?? 500,
      "An unexpected error occurred.",
    );
  },
);

setupAuthInterceptors(apiClient, {
  onSessionExpired: notifySessionExpired,
});
