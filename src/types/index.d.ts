import type { ContentfulStatusCode } from "hono/utils/http-status";

export interface ApiResponse<T = unknown> {
    success: boolean;
    code: ContentfulStatusCode
    message: string;
    data?: T | null;
    pagination?: Pagination;
    error?: unknown;
}

export interface DefaultPayload { user_id: string, session_id: string; }