import type {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from "axios";

import { refreshRequest } from "@/features/auth/api/auth.api";
import {
  clearAccessToken,
  getAccessToken,
  setAccessToken,
} from "@/shared/auth/accessToken";

interface AuthInterceptorOptions {
  onSessionExpired: () => void;
}

function isRefreshRequest(url: string | undefined): boolean {
  return url?.includes("/auth/refresh") ?? false;
}

function isLoginRequest(url: string | undefined): boolean {
  return url?.includes("/auth/login") ?? false;
}

function shouldSkipRefresh(url: string | undefined): boolean {
  return isRefreshRequest(url) || isLoginRequest(url);
}

function toError(value: unknown): Error {
  return value instanceof Error ? value : new Error("Request failed.");
}

export function setupAuthInterceptors(
  client: AxiosInstance,
  options: AuthInterceptorOptions,
): void {
  const { onSessionExpired } = options;

  client.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const token = getAccessToken();

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
    },
    (error: unknown) => Promise.reject(toError(error)),
  );

  let refreshPromise: Promise<string> | null = null;

  function getRefreshedAccessToken(): Promise<string> {
    if (!refreshPromise) {
      refreshPromise = refreshRequest()
        .then((token) => {
          setAccessToken(token);
          return token;
        })
        .catch((error: unknown) => {
          clearAccessToken();
          onSessionExpired();
          throw toError(error);
        })
        .finally(() => {
          refreshPromise = null;
        });
    }

    return refreshPromise;
  }

  client.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as
        | (InternalAxiosRequestConfig & { _retry?: boolean })
        | undefined;

      if (!originalRequest || error.response?.status !== 401) {
        return Promise.reject(toError(error));
      }

      if (shouldSkipRefresh(originalRequest.url)) {
        return Promise.reject(toError(error));
      }

      if (originalRequest._retry) {
        return Promise.reject(toError(error));
      }

      originalRequest._retry = true;

      try {
        const token = await getRefreshedAccessToken();
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return await client(originalRequest);
      } catch (refreshError) {
        return Promise.reject(toError(refreshError));
      }
    },
  );
}
