import axios, { type AxiosError } from "axios";

import { ApiClientError } from "@/shared/api/types";
import type { ApiErrorResponse } from "@/shared/api/types";

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
