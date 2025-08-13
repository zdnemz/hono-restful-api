import { db } from "@/lib/db";
import handler from "@/lib/handler";
import JWT from "@/lib/jwt";
import { getRedisClient } from "@/lib/redis";
import { response } from "@/lib/response";
import { validate } from "@/lib/validate";
import Session from "@/services/session";
import { setCookie } from "hono/cookie";
import { nanoid } from "nanoid";
import z from "zod";

const registerVerifySchema = z.object({
    userId: z.string("User Id must be string").min(12, "User Id must be at least 6 characters"),
    otpId: z.string("OTP Id must be string").min(12, "User Id must be at least 6 characters"),
    otp: z
        .string("OTP must be string")
        .min(6, "OTP must be exactly 6 characters")
        .max(6, "OTP must be exactly 6 characters")
});


export const registerVerify = handler(async (c) => {
    const data = await c.req.json()

    const validated = await validate(registerVerifySchema, data)
    if (!validated.success) return response(c, 400, validated.error);

    const { userId, otpId, otp } = validated.data

    const redis = getRedisClient()

    const otp_key = `otp:${otpId}`

    // get otp on redis
    const redisOtp = await redis.get(otp_key)
    if (!redisOtp || redisOtp !== otp.toUpperCase()) return response(c, 401, "OTP is not valid");

    const user = await db.user.findUnique({ where: { id: userId }, select: { id: true } });
    if (!user) {
        return response(c, 404, "User not found");
    }

    await db.user.update({
        where: { id: userId },
        data: {
            isVerified: true
        },
    })

    // delete otp from redis
    redis.del(otp_key)

    const session_id = nanoid()

    // sign jwt
    const access_token = JWT.signAccessToken({ session_id, user_id: userId });
    const refresh_token = JWT.signRefreshToken({ session_id, user_id: userId });

    // save session to redis
    await Session.save(userId, session_id, refresh_token)

    setCookie(c, "refresh_token", refresh_token, {
        maxAge: 7 * 24 * 60 * 60, // 7 days
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        path: "/"
    })

    return response(c, 200, {
        accessToken: access_token,
    })
})