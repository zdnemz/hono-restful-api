import handler from "@/lib/handler";
import { response } from "@/lib/response";

export const healthCheck = handler((c) => {
    return response(c, 200, { health: "OK" })
})