import handler from "@/lib/handler";
import type { DefaultPayload } from "@/types";
import { response } from "@/lib/response";

export const authCheck = handler((c) => {
    const { session_id } = c.get("auth_payload") as DefaultPayload;

    return response(c, 200, { session_id })
})