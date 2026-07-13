import { getJson } from "@/shared/api/getJson";
import { postJson } from "@/shared/api/postJson";
import type {
  AuthUser,
  LoginCredentials,
  LoginResponse,
  RefreshResponse,
} from "@/features/auth/types/auth.types";

export async function loginRequest(
  credentials: LoginCredentials,
): Promise<LoginResponse> {
  const response = await postJson<LoginResponse>("/auth/login", credentials);
  return response.data;
}

export async function refreshRequest(): Promise<string> {
  const response = await postJson<RefreshResponse>("/auth/refresh");
  return response.data.accessToken;
}

export async function logoutRequest(): Promise<void> {
  await postJson<Record<string, never>>("/auth/logout");
}

export async function getCurrentUserRequest(): Promise<AuthUser> {
  const response = await getJson<AuthUser>("/auth/me");
  return response.data;
}
