import { Hono } from "hono";
import middleware from "@/lib/middleware";

import { authCheck } from "./check";
import { register } from "./register";

const auth = new Hono()

auth.get("/check", middleware.auth, authCheck)
auth.post("/register", register)

export default auth