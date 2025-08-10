import { response } from "@/lib/response";
import type { Handler } from "hono";
import { getCookie } from "hono/cookie";
import JWT from "./jwt";
import type { DefaultPayload } from "@/types";

const auth = (<T = DefaultPayload>(): Handler => {
    return async (c, next) => {
        try {
            const auth_token = getCookie(c, "auth_token");
            if (!auth_token) return response(c, 401, "You don't have any permission to access this endpoint.");

            const payload: T | null = JWT.verify(auth_token)
            if (!payload) return response(c, 401, "You don't have any permission to access this endpoint.");

            c.set("auth_payload", payload)

            next()
        } catch (error) {
            console.error(`[auth] Error:`, (error as Error).message);
            return response(c, 500, "Internal server error");
        }
    };
});

const middleware = {
    auth: auth()
}

export default middleware