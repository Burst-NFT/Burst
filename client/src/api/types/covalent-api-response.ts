export interface CovalentApiResponse<T> {
  data?: T | null;
  error: boolean;
  error_message?: string | null;
  error_code?: number | null;
}
