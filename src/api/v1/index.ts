import { response } from "@/lib/response";
import { Hono } from "hono";
import { healthCheck } from "./health";

const v1 = new Hono()

v1.all("/", healthCheck)

export default v1