import jwt, { type SignOptions } from "jsonwebtoken";

export default class JWT {
    private static readonly JWT_SECRET: string = process.env.JWT_SECRET as string;
    private static readonly JWT_OPTIONS: SignOptions = {
        expiresIn: "7d",
    };

    public static sign<T extends object>(payload: T): string {
        return jwt.sign(payload, this.JWT_SECRET, this.JWT_OPTIONS);
    }

    public static verify<T>(token: string): T {
        return jwt.verify(token, this.JWT_SECRET) as T;
    }
}
