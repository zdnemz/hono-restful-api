import { Hono } from "hono";
import { healthCheck } from "./health";
import auth from "./auth";

const v1 = new Hono()

v1.all("/", healthCheck)

// routes
v1.route("/auth", auth)

export default v1