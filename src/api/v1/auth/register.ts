import { db } from "@/lib/db";
import Email from "@/lib/email";
import handler from "@/lib/handler";
import JWT from "@/lib/jwt";
import OTP from "@/lib/otp";
import { getRedisClient } from "@/lib/redis";
import { response } from "@/lib/response";
import { validate } from "@/lib/validate";
import z from "zod";

const registerSchema = z.object({
    email: z.email({ message: "Email is not valid" }),
    username: z
        .string("Username must be string")
        .min(3, "Username must be at least 3 characters")
        .max(20, "Username cannot be more than 20 characters"),
    password: z
        .string("Password must be string")
        .min(8, "Password must be at least 8 characters")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter")
        .regex(/[0-9]/, "Password must contain at least one number")
        .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
    fullName: z.string("Full name must be string").min(1, "Full name is required"),
});


export const register = handler(async (c) => {
    const data = await c.req.json()

    const validated = await validate(registerSchema, data)
    if (!validated.success) return response(c, 400, validated.error);

    const user = await db.user.create({
        data: validated.data,
        select: {
            id: true,
            email: true,
            username: true,
        }
    })

    const otp = OTP.generate(6);

    // set otp on redis
    const redis = getRedisClient()
    await redis.set(`otp:${user.id}`, otp, 'EX', 300) // expire in 5 minutes

    // otp send via email
    // await Email.sendOTP({ to: user.email, name: user.username, otp })

    // return response(c, 201, {id: user.id})

    return response(c, 201, { userId: user.id, otp })
})