import type { Context } from "hono";

export function getBearerToken(c: Context) {
    try {
        const authHeader = c.req.header("Authorization")
        if (!authHeader) return null;

        if (authHeader.startsWith("Bearer ")) {
            const token = authHeader.split(" ")[1] || null;
            return token
        }

        return null
    } catch {
        return null
    }
}