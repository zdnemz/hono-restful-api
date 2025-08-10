import { db } from "@/lib/db";
import handler from "@/lib/handler";
import JWT from "@/lib/jwt";
import { getRedisClient } from "@/lib/redis";
import { response } from "@/lib/response";
import { validate } from "@/lib/validate";
import { setCookie } from "hono/cookie";
import z from "zod";

const registerVerifySchema = z.object({
    userId: z.string("User Id must be string").min(12, "User Id must be at least 6 characters"),
    otp: z
        .string("OTP must be string")
        .min(6, "OTP must be at least 6 characters")
        .max(6, "OTP cannot be more than 6 characters")
});


export const registerVerify = handler(async (c) => {
    const data = await c.req.json()

    const validated = await validate(registerVerifySchema, data)
    if (!validated.success) return response(c, 400, validated.error);

    const { userId, otp } = validated.data

    // get otp on redis
    const redis = getRedisClient()

    const redisOtp = await redis.get(`otp:${userId}`)
    if (!redisOtp || redisOtp !== otp) return response(c, 401, "OTP is not valid");

    await db.user.update({
        where: { id: userId },
        data: {
            isVerified: true
        },
        select: {}
    })

    // sign jwt
    const auth_token = JWT.sign({ session_id: userId });

    setCookie(c, "auth_token", auth_token)

    return response(c, 200)
})