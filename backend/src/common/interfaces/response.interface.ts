export interface ApiResponse<T> {
  success: boolean;
  error: any[];
  data: T;
  metadata: any;
}
