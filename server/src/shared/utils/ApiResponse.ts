interface ApiSuccessResponse<T> {
  success: true;
  message: string;
  data: T;
}

export function ApiResponse<T>(message: string, data: T): ApiSuccessResponse<T> {
  return {
    success: true,
    message,
    data,
  };
}
