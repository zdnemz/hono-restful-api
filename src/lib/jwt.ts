import type { DefaultPayload } from "@/types";
import jwt, { JsonWebTokenError } from "jsonwebtoken";
import type { SignOptions } from "jsonwebtoken";

export default class JWT {
    private static readonly JWT_SECRET: string = process.env.JWT_SECRET as string;
    private static readonly JWT_OPTIONS: SignOptions = {
        expiresIn: "7d",
    };

    public static sign<T extends object = DefaultPayload>(payload: T): string {
        return jwt.sign(payload, this.JWT_SECRET, this.JWT_OPTIONS);
    }

    public static verify<T = DefaultPayload>(token: string): T | null {
        try {
            return jwt.verify(token, this.JWT_SECRET) as T;
        } catch (err) {
            if (err instanceof JsonWebTokenError) {
                console.warn("JWT verification failed:", err.message);
            }
            return null;
        }
    }
}
