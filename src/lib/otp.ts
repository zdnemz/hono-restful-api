import { randomBytes } from "crypto";
import { nanoid } from "nanoid";

export default class OTP {

    public static generate(length: number = 6): { otp: string, otp_id: string } {
        const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        const bytes = randomBytes(length);

        const otp_id = nanoid(12)

        return {
            otp_id,
            otp: Array.from(bytes, (byte) => chars[byte % chars.length]).join(""),
        }
    }
}