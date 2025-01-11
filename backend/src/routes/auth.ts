import { Hono } from "hono"
import { zValidator } from "@hono/zod-validator"

import { adminSignIn, adminSignUp } from "@/controllers/authController"
import { adminSignInSchema, adminSignUpSchema } from "@/schemas/authSchema"

export const authRoutes = new Hono()
  .post("/admin-sign-up", zValidator("json", adminSignUpSchema), adminSignUp)
  .post("/admin-sign-in", zValidator("json", adminSignInSchema), adminSignIn)
