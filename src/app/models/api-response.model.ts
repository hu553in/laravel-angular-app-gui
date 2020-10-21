export interface ApiResponse<T> {
  status_code: number;
  errors: string[];
  data: T;
}
