import { Hono } from "hono"
import { cors } from "hono/cors"

import { authRoutes } from "./routes/auth"
import { authMiddleware } from "./middleware/auth"

const app = new Hono<{ Variables: Variables }>()

app.use("*", cors())

app.use("/api/*", authMiddleware)

app.route("/auth", authRoutes)

export default {
  port: process.env.PORT || 8888,
  fetch: app.fetch,
}
