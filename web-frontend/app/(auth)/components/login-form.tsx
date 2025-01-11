"use client"

import { z } from "zod"
import { toast } from "sonner"
import Cookies from "js-cookie"
import { useState } from "react"
import axios, { AxiosError } from "axios"
import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { Eye, EyeOff, Loader, ShoppingCart } from "lucide-react"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { STORE_NAME } from "@/constants/values"

const loginSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(8, { message: "Should be minimum 8 characters" })
    .max(20, { message: "Should be maximum 20 characters" })
})

export const LoginForm = () => {
  const router = useRouter()

  const [showPassword, setShowPassword] = useState<boolean>(false)

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  })

  const { isSubmitting } = form.formState

  const onSubmit = async (values: z.infer<typeof loginSchema>) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/admin-sign-in`,
        values
      )

      if (response instanceof AxiosError) throw response

      const { accessToken, refreshToken } = response.data.data

      Cookies.set("accessToken", accessToken, {
        path: "/",
        expires: 7,
        secure: true,
        sameSite: "strict"
      })

      Cookies.set("refreshToken", refreshToken, {
        path: "/",
        expires: 7,
        secure: true,
        sameSite: "strict"
      })

      toast.success("Login Successful", {
        description: "Redirecting to dashboard."
      })

      router.refresh()
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.error[0].name, {
          description: error.response?.data.error[0].message
        })
      } else {
        toast.error("Network Error", { description: "Please try again later." })
      }
    }
  }

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-y-6"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="flex flex-col items-center gap-y-2">
          <div className="flex flex-col items-center gap-y-2 font-medium">
            <ShoppingCart className="size-6 animate-bounce text-primary" />
            <span className="sr-only">{STORE_NAME}</span>
          </div>
          <h1 className="text-xl font-bold">Welcome to {STORE_NAME} Admin</h1>
          <div className="text-center text-sm">
            Please enter your credentials to access the admin dashboard.
          </div>
        </div>

        <div className="flex flex-col gap-y-6">
          <FormField
            name="email"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    autoFocus
                    disabled={isSubmitting}
                    placeholder="example@mail.com"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="password"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      {...field}
                      placeholder="********"
                      disabled={isSubmitting}
                      type={showPassword ? "text" : "password"}
                    />
                    <Button
                      size="icon"
                      type="button"
                      variant="ghost"
                      className="absolute right-0 top-0 rounded-l-none"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <Eye className="size-5" />
                      ) : (
                        <EyeOff className="size-5" />
                      )}
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <span className="flex items-center gap-x-2">
                <Loader className="size-5 animate-spin" /> Logging In
              </span>
            ) : (
              "Login"
            )}
          </Button>
        </div>
      </form>
    </Form>
  )
}
