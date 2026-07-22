export interface ApiSuccessResponse<T> {
  success: true;
  message: string;
  data: T;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  errors: Array<{ field: string; message: string }>;
}

export function parseApiSuccess<T>(body: unknown): ApiSuccessResponse<T> {
  return body as ApiSuccessResponse<T>;
}

export function parseApiError(body: unknown): ApiErrorResponse {
  return body as ApiErrorResponse;
}
