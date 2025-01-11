import { verify } from "jsonwebtoken"
import { MiddlewareHandler } from "hono"

export const authMiddleware: MiddlewareHandler = async (c, next) => {
  const token = c.req.header("Authorization")?.split(" ")[1]

  if (!token) {
    return c.json(
      {
        success: false,
        error: [{ name: "Unauthorized", message: "Token is missing" }],
      },
      401
    )
  }

  try {
    const payload = await new Promise<any>((resolve, reject) =>
      verify(token, process.env.ACCESS_TOKEN_SECRET!, (err, decoded) => {
        if (err) reject(err)
        else resolve(decoded)
      })
    )

    c.set("id", payload.id)
  } catch (err) {
    return c.json(
      {
        success: false,
        error: [{ name: "Forbidden", message: "Invalid token" }],
      },
      403
    )
  }

  await next()
}
