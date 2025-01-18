import { Context } from "hono"
import { verify } from "jsonwebtoken"
import { setCookie } from "hono/cookie"

import { db } from "@/utils/db"

export const adminDetails = async (c: Context) => {
  const id = c.get("id")

  try {
    const user = await db.admin.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    return c.json(user, 200)
  } catch (error) {
    console.error("Admin Fetch Error:", error)
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

export const adminSignOut = async (c: Context) => {
  const { refreshToken } = await c.req.json()

  if (!refreshToken) {
    return c.json(
      {
        success: false,
        error: [
          {
            name: "Unauthorized Error",
            message: "Refresh token is required.",
          },
        ],
      },
      401
    )
  }

  try {
    verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!, (err: any) => {
      if (!!err)
        return c.json(
          {
            success: false,
            error: [
              {
                name: "Invalid Token Error",
                message: "The provided refresh token is invalid or expired.",
              },
            ],
          },
          403
        )
    })

    const id = c.get("id")

    if (!id)
      return c.json(
        {
          success: false,
          error: [
            {
              name: "Unauthorized Error",
              message: "User ID could not be retrieved from the token.",
            },
          ],
        },
        403
      )

    const admin = await db.admin.findUnique({
      where: { id },
      select: { refreshToken: true },
    })

    if (!admin)
      return c.json(
        {
          success: false,
          error: [
            {
              name: "Admin Not Found Error",
              message: "Admin not found.",
            },
          ],
        },
        403
      )

    const tokenPresent = admin.refreshToken.some(
      (data) => data.token === refreshToken
    )

    if (!tokenPresent)
      return c.json(
        {
          success: false,
          error: [
            {
              name: "Invalid Token Error",
              message: "The provided refresh token is not valid for this user.",
            },
          ],
        },
        403
      )

    // Delete the accessToken cookie
    setCookie(c, "accessToken", "", {
      path: "/", // Ensure the path matches the original cookie
      secure: true,
      sameSite: "Strict",
      maxAge: 0, // Setting maxAge to 0 removes the cookie
    })

    // Delete the refreshToken cookie
    setCookie(c, "refreshToken", "", {
      path: "/", // Ensure the path matches the original cookie
      secure: true,
      sameSite: "Strict",
      maxAge: 0, // Setting maxAge to 0 removes the cookie
    })

    await db.refreshToken.deleteMany({
      where: { token: refreshToken },
    })

    return c.json(
      {
        success: true,
        message: "Admin logged out successfully.",
      },
      200
    )
  } catch (error) {
    console.log("Auth Logout", error)
    return c.json(
      {
        success: false,
        error: [
          {
            name: "Server Error",
            message: "An unexpected error occurred. Please try again later.",
          },
        ],
      },
      500
    )
  }
}

export const adminSignOutAllSessions = async (c: Context) => {
  try {
    const id = c.get("id")

    if (!id)
      return c.json(
        {
          success: false,
          error: [
            {
              name: "Unauthorized Error",
              message: "User ID could not be retrieved from the token.",
            },
          ],
        },
        403
      )

    const user = await db.admin.findUnique({
      where: { id },
      select: { refreshToken: true },
    })

    if (!user)
      return c.json(
        {
          success: false,
          error: [
            {
              name: "User Not Found Error",
              message: "User not found.",
            },
          ],
        },
        403
      )

    // Delete the accessToken cookie
    setCookie(c, "accessToken", "", {
      path: "/", // Ensure the path matches the original cookie
      secure: true,
      sameSite: "Strict",
      maxAge: 0, // Setting maxAge to 0 removes the cookie
    })

    // Delete the refreshToken cookie
    setCookie(c, "refreshToken", "", {
      path: "/", // Ensure the path matches the original cookie
      secure: true,
      sameSite: "Strict",
      maxAge: 0, // Setting maxAge to 0 removes the cookie
    })

    await db.refreshToken.deleteMany({
      where: { adminId: id },
    })

    return c.json(
      {
        success: true,
        message: "Admin logged out successfully.",
      },
      200
    )
  } catch (error) {
    console.log("Auth All Sessions Logout", error)
    return c.json(
      {
        success: false,
        error: [
          {
            name: "Server Error",
            message: "An unexpected error occurred. Please try again later.",
          },
        ],
      },
      500
    )
  }
}
