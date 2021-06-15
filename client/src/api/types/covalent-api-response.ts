export interface CovalentApiResponse<T> {
  data?: CovalentApiData<T> | null;
  error: boolean;
  error_message?: string | null;
  error_code?: number | null;
}

export interface CovalentApiData<T> {
  items?: T | null;
  pagination: any;
}
