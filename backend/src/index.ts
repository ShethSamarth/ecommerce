import { Hono } from "hono"
import { cors } from "hono/cors"

import { authRoutes } from "./routes/auth"
import { adminRoutes } from "./routes/admin"
import { authMiddleware } from "./middleware/auth"

const app = new Hono<{ Variables: Variables }>()

app.use(
  "*",
  cors({
    credentials: true,
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
  })
)

app.use("/api/*", authMiddleware)

app.route("/auth", authRoutes).basePath("/api").route("/admin", adminRoutes)

export default {
  port: process.env.PORT || 8888,
  fetch: app.fetch,
}
