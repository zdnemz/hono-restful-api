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

const loginSchema = z.object({
    email: z.email({ message: "Email is not valid" }).optional(),
    username: z
        .string("Username must be string")
        .min(3, "Username must be at least 3 characters")
        .max(20, "Username cannot be more than 20 characters").optional(),
    password: z
        .string("Password must be string")
        .min(8, "Password must be at least 8 characters")
});


export const login = handler(async (c) => {
    const data = await c.req.json();

    const validated = await validate(loginSchema, data);
    if (!validated.success) return response(c, 400, validated.error);

    const { email, username, password } = validated.data;

    if (!email && !username) {
        return response(c, 400, "Either email or username must be provided");
    }

    const user = await db.user.findFirst({
        where: {
            OR: [
                email ? { email } : undefined,
                username ? { username } : undefined,
            ].filter(Boolean) as any[],
        },
        select: {
            id: true,
            password: true,
        },
    });

    if (!user) return response(c, 401, "Email or Username or Password is not valid");

    const isPasswordMatch = await Bun.password.verify(password, user.password);
    if (!isPasswordMatch) return response(c, 401, "Email or Username or Password is not valid");

    const session_id = nanoid()

    const access_token = JWT.signAccessToken({ session_id: user.id });
    const refresh_token = JWT.signRefreshToken({ session_id: user.id });

    // save session to redis
    await Session.save(user.id, session_id, refresh_token)

    setCookie(c, "refresh_token", refresh_token, {
        maxAge: 7 * 24 * 60 * 60, // 7 days
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        path: "/"
    })

    return response(c, 200, {
        accessToken: access_token,
    })
});