import { sign } from "jsonwebtoken"

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET!
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET!

export const generateAccessToken = (payload: Record<string, any>): string => {
  return sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: "24h" })
}

export const generateRefreshToken = (payload: Record<string, any>): string => {
  return sign(payload, REFRESH_TOKEN_SECRET, { expiresIn: "7d" })
}
