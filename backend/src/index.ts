import { Hono } from "hono"

const app = new Hono()

app.get("/", (c) => {
  return c.text("Hello Backend!")
})

export default {
  port: process.env.PORT || 8888,
  fetch: app.fetch,
}
