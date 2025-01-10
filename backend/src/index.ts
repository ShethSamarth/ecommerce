import { Hono } from "hono"

import { authMiddleware } from "./middleware/auth"

const app = new Hono<{ Variables: Variables }>()

app.use("/api/*", authMiddleware)

export default {
  port: process.env.PORT || 8888,
  fetch: app.fetch,
}
