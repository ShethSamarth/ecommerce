import { Hono } from "hono"
import { zValidator } from "@hono/zod-validator"

import {
  adminDetails,
  adminSignOut,
  adminSignOutAllSessions,
} from "@/controllers/adminController"
import { tokenSchema } from "@/schemas/authSchema"

export const adminRoutes = new Hono()
  .get("/get-details", adminDetails)
  .post("/sign-out", zValidator("json", tokenSchema), adminSignOut)
  .post("/sign-out-all-sessions", adminSignOutAllSessions)
