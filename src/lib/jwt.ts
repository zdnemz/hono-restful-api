import type { DefaultPayload } from "@/types";
import jwt from "jsonwebtoken";
import type { SignOptions } from "jsonwebtoken";

export default class JWT {
    private static readonly ACCESS_TOKEN_SECRET: string = process.env.ACCESS_TOKEN_SECRET!;
    private static readonly REFRESH_TOKEN_SECRET: string = process.env.REFRESH_TOKEN_SECRET!;

    private static readonly ACCESS_TOKEN_OPTIONS: SignOptions = {
        expiresIn: "15m",
    };

    private static readonly REFRESH_TOKEN_OPTIONS: SignOptions = {
        expiresIn: "7d",
    };

    public static signAccessToken<T extends object = DefaultPayload>(payload: T): string {
        return jwt.sign(payload, this.ACCESS_TOKEN_SECRET, this.ACCESS_TOKEN_OPTIONS);
    }

    public static signRefreshToken<T extends object = DefaultPayload>(payload: T): string {
        return jwt.sign(payload, this.REFRESH_TOKEN_SECRET, this.REFRESH_TOKEN_OPTIONS);
    }

    public static verifyAccessToken<T = DefaultPayload>(token: string): T | null {
        try {
            return jwt.verify(token, this.ACCESS_TOKEN_SECRET) as T;
        } catch {
            return null;
        }
    }

    public static verifyRefreshToken<T = DefaultPayload>(token: string): T | null {
        try {
            return jwt.verify(token, this.REFRESH_TOKEN_SECRET) as T;
        } catch {
            return null;
        }
    }
}
