import crypto from "crypto";

export default class Signature {
    private static readonly SIGNATURE_SECRET = process.env.SIGNATURE_SECRET!;

    public static generate(value: string) {
        return crypto.createHmac("sha256", this.SIGNATURE_SECRET).update(value).digest("hex");
    }

    public static verifySignature(value: string, signature: string) {
        const expected = Buffer.from(this.generate(value), "hex");
        const sigBuffer = Buffer.from(signature, "hex");
        if (expected.length !== sigBuffer.length) return false;

        return crypto.timingSafeEqual(expected, sigBuffer);
    }
}


