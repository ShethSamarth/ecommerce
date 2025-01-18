import { Hono } from "hono"
import { zValidator } from "@hono/zod-validator"

import {
  adminSignInSchema,
  adminSignUpSchema,
  tokenSchema,
} from "@/schemas/authSchema"
import {
  adminSignIn,
  adminSignUp,
  refreshAdminToken,
} from "@/controllers/authController"

export const authRoutes = new Hono()
  .post("/admin-sign-up", zValidator("json", adminSignUpSchema), adminSignUp)
  .post("/admin-sign-in", zValidator("json", adminSignInSchema), adminSignIn)
  .post(
    "/admin-refresh-token",
    zValidator("json", tokenSchema),
    refreshAdminToken
  )
