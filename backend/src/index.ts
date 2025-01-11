import { Hono } from "hono"

import { authRoutes } from "./routes/auth"
import { authMiddleware } from "./middleware/auth"

const app = new Hono<{ Variables: Variables }>()

app.use("/api/*", authMiddleware)

app.route("/auth", authRoutes)

export default {
  port: process.env.PORT || 8888,
  fetch: app.fetch,
}
