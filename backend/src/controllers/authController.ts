import { Context } from "hono"
import { verify } from "jsonwebtoken"
import { setCookie } from "hono/cookie"

import { db } from "@/utils/db"
import { comparePasswords, hashPassword } from "@/utils/password"
import { generateAccessToken, generateRefreshToken } from "@/utils/jwt"

export const adminSignUp = async (c: Context) => {
  const { firstName, lastName, email, password } = await c.req.json()

  try {
    // Check if email is already in use
    const existingAdmin = await db.admin.findUnique({
      where: { email },
    })

    if (existingAdmin) {
      return c.json(
        {
          success: false,
          error: [
            {
              name: "Email Conflict Error",
              message: "An account with this email already exists.",
            },
          ],
        },
        409
      )
    }

    // Hash the password
    const hashedPassword = await hashPassword(password)

    // Create admin record
    const newAdmin = await db.admin.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword,
      },
    })

    return c.json(
      {
        success: true,
        message: "Admin registered successfully",
        data: { id: newAdmin.id, email: newAdmin.email },
      },
      201
    )
  } catch (error) {
    console.error("Admin Registration Error:", error)
    return c.json(
      {
        success: false,
        error: [
          {
            name: "Internal Server Error",
            message: "Something went wrong while registering the admin.",
          },
        ],
      },
      500
    )
  }
}

export const adminSignIn = async (c: Context) => {
  const { email, password } = await c.req.json()

  try {
    // Check if the admin exists
    const admin = await db.admin.findUnique({
      where: { email },
      include: { refreshToken: true },
    })

    if (!admin) {
      return c.json(
        {
          success: false,
          error: [
            {
              name: "Authentication Error",
              message: "Invalid email or password.",
            },
          ],
        },
        401
      )
    }

    // Verify the password
    const isPasswordValid = await comparePasswords(password, admin.password)
    if (!isPasswordValid) {
      return c.json(
        {
          success: false,
          error: [
            {
              name: "Authentication Error",
              message: "Invalid email or password.",
            },
          ],
        },
        401
      )
    }

    // Generate tokens
    const accessToken = generateAccessToken({ id: admin.id })
    const refreshToken = generateRefreshToken({ id: admin.id })

    // Store refresh token in the database
    await db.admin.update({
      where: { id: admin.id },
      data: {
        refreshToken: {
          create: {
            token: refreshToken,
          },
        },
      },
    })

    // Set cookies for accessToken and refreshToken
    setCookie(c, "accessToken", accessToken, {
      secure: true,
      sameSite: "Strict",
      maxAge: 86400, // 1 day
      path: "/",
    })

    setCookie(c, "refreshToken", refreshToken, {
      secure: true,
      sameSite: "Strict",
      maxAge: 604800, // 7 days
      path: "/",
    })

    return c.json({
      success: true,
      message: "Login successful.",
      data: { accessToken, refreshToken },
    })
  } catch (error) {
    console.error("Admin Login Error:", error)
    return c.json(
      {
        success: false,
        error: [
          {
            name: "Internal Server Error",
            message: "Something went wrong while logging in.",
          },
        ],
      },
      500
    )
  }
}

export const refreshAdminToken = async (c: Context) => {
  const { refreshToken } = await c.req.json()

  if (!refreshToken) {
    return c.json(
      {
        success: false,
        error: [
          {
            name: "Missing Token Error",
            message: "Refresh token is required.",
          },
        ],
      },
      400
    )
  }

  try {
    verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET!,
      (err: any, payload: any) => {
        if (!!err)
          return c.json(
            {
              success: false,
              error: [
                {
                  name: "Invalid Token Error",
                  message: "Invalid or expired refresh token.",
                },
              ],
            },
            403
          )

        c.set("id", payload.id)
      }
    )

    const id = c.get("id")

    if (!id) {
      return c.json(
        {
          success: false,
          error: [
            {
              name: "Unauthorized Error",
              message: "User ID is missing in token payload.",
            },
          ],
        },
        403
      )
    }

    const admin = await db.admin.findUnique({
      where: { id },
      select: { refreshToken: true },
    })

    if (!admin) {
      return c.json(
        {
          success: false,
          error: [
            {
              name: "User Not Found Error",
              message: "Admin not found.",
            },
          ],
        },
        404
      )
    }

    const tokenPresent = admin.refreshToken.some(
      (data) => data.token === refreshToken
    )

    if (!tokenPresent) {
      return c.json(
        {
          success: false,
          error: [
            {
              name: "Token Mismatch Error",
              message: "Refresh token does not match any stored token.",
            },
          ],
        },
        403
      )
    }

    // Generate tokens
    const accessToken = generateAccessToken({ id })
    const newRefreshToken = generateRefreshToken({ id })

    // Set new cookies for accessToken and refreshToken
    setCookie(c, "accessToken", accessToken, {
      secure: true,
      sameSite: "Strict",
      maxAge: 86400, // 1 day
      path: "/",
    })

    setCookie(c, "refreshToken", newRefreshToken, {
      secure: true,
      sameSite: "Strict",
      maxAge: 604800, // 7 days
      path: "/",
    })

    // Delete old refresh token
    await db.refreshToken.deleteMany({
      where: { token: refreshToken },
    })

    // Store new refresh token in the database
    await db.admin.update({
      where: { id },
      data: {
        refreshToken: {
          create: {
            token: newRefreshToken,
          },
        },
      },
    })

    return c.json(
      {
        success: true,
        message: "Token refreshed successfully.",
        data: { accessToken, refreshToken: newRefreshToken },
      },
      200
    )
  } catch (error) {
    console.error("Auth Refresh Token Error:", error)
    return c.json(
      {
        success: false,
        error: [
          {
            name: "ServerError",
            message: "An unexpected error occurred. Please try again later.",
          },
        ],
      },
      500
    )
  }
}
