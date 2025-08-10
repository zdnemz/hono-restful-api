import { Hono } from "hono"
import { cors } from "hono/cors"
import { logger } from "hono/logger"
import { response } from "./lib/response"
import api from "./api"

const app = new Hono()

// all middlware
app.use('*', cors())
app.use('*', logger())

app.route("/api", api)

// notfound handler
app.notFound(c => response(c, 404, "Endpoint not found. Please check the URL or refer to the API documentation."))

export default app