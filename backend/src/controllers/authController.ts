import { Context } from "hono"

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
