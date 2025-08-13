import { response } from "@/lib/response";
import type { Handler } from "hono";
import JWT from "./jwt";
import type { DefaultPayload } from "@/types";
import { getBearerToken } from "./utils";

const auth = <T = DefaultPayload>(): Handler => {
    return async (c, next) => {
        try {
            const access_token = getBearerToken(c);
            if (!access_token) return response(c, 401, "You don't have permission to access this endpoint.");

            const payload: T | null = JWT.verifyAccessToken(access_token);
            if (!payload) return response(c, 401, "You don't have permission to access this endpoint.");

            c.set("auth_payload", payload);

            await next();
        } catch (error) {
            console.error(`[auth] Error:`, (error as Error).message);
            return response(c, 500, "Internal server error");
        }
    };
};

const middleware = {
    auth: auth(),
};

export default middleware;
