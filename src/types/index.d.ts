export interface ApiResponse<T = unknown> {
    success: boolean;
    message: string;
    data?: T | null;
    pagination?: Pagination;
    error?: unknown;
}