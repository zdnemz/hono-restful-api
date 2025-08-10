import { randomBytes } from "crypto";

export default class OTP {

    public static generate(length: number= 6): string {
        const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
        const bytes = randomBytes(length);
        // map tiap byte ke karakter dalam chars dengan modulus
        return Array.from(bytes, (byte) => chars[byte % chars.length]).join("");
    }
}