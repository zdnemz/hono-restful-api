import { db } from "@/lib/db";
import handler from "@/lib/handler";
import JWT from "@/lib/jwt";
import { response } from "@/lib/response";
import { validate } from "@/lib/validate";
import { setCookie } from "hono/cookie";
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
    const data = await c.req.json()

    const validated = await validate(loginSchema, data)
    if (!validated.success) return response(c, 400, validated.error);

    const { email, username, password } = validated.data

    const user = await db.user.findUnique({
        where: { email, username }, select: {
            id: true,
            password: true
        }
    })
    if (!user) return response(c, 404, "User is not found")

    // verify password
    const isPasswordMatch = await Bun.password.verify(password, user.password)
    if (!isPasswordMatch) return response(c, 401, `${email ? "Email" : "Username"} or Password is not valid`)

    // sign jwt
    const auth_token = JWT.sign({ session_id: user.id });

    setCookie(c, "auth_token", auth_token)

    return response(c, 200)
})