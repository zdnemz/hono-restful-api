import { Hono } from "hono";
import middleware from "@/lib/middleware";

import { authCheck } from "./check";
import { register } from "./register";
import { registerVerify } from "./register-verify";

const auth = new Hono()

auth.get("/check", middleware.auth, authCheck)
auth.post("/register", register)
auth.post("/register-verify", registerVerify)

export default auth