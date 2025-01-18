import axios from "axios"
import { toast } from "sonner"
import { jwtDecode } from "jwt-decode"

import { getCookie } from "./utils"

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" }
})

apiClient.interceptors.request.use(
  async (config) => {
    const accessToken = getCookie("accessToken")

    if (accessToken) {
      const date = new Date()
      const decodedToken = jwtDecode(accessToken)

      if (decodedToken.exp! * 1000 < date.getTime()) {
        const data = await getRefreshToken()

        config.headers["Authorization"] = `Bearer ${data.accessToken}`
      } else {
        config.headers["Authorization"] = `Bearer ${accessToken}`
      }
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

const getRefreshToken = async () => {
  try {
    const refreshToken = getCookie("refreshToken")

    const result = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/admin-refresh-token`,
      { refreshToken },
      { withCredentials: true }
    )

    return result.data.data
  } catch (error) {
    console.log("Refresh Token Error: ", error)
    toast.error("Network Error", {
      description: "Please try again after some time."
    })
  }
}
