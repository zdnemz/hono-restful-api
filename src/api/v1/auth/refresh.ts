import handler from "@/lib/handler";
import JWT from "@/lib/jwt";
import { response } from "@/lib/response";
import Session from "@/services/session";
import { getCookie } from "hono/cookie";

export const refreshToken = handler(async (c) => {

    const refresh_token = getCookie(c, "refresh_token");
    if (!refresh_token) {
        return response(c, 401, "Refresh token is missing");
    }

    const payload = JWT.verifyRefreshToken(refresh_token);
    if (!payload) {
        return response(c, 401, "Invalid refresh token");
    }

    const { session_id, user_id } = payload;
    if (!session_id || !user_id) {
        return response(c, 401, "Invalid token payload");
    }

    const storedToken = await Session.get(user_id, session_id)
    if (!storedToken || storedToken.refresh_token !== refresh_token) {
        return response(c, 401, "Refresh token is revoked or expired");
    }

    const newAccessToken = JWT.signAccessToken({ session_id, user_id });

    return response(c, 200, {
        accessToken: newAccessToken,
    });
});
