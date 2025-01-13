import type { Metadata } from "next"
import { ThemeProvider } from "next-themes"

import { STORE_NAME, THEME_STORAGE_KEY } from "@/constants/values"
import { ThemeColorProvider } from "@/components/providers/theme-color-provider"

import "./globals.css"

export const metadata: Metadata = {
  title: {
    default: STORE_NAME,
    template: `%s | ${STORE_NAME}`
  },
  description:
    "Effortlessly manage your eCommerce store with our powerful admin panel. Track sales, manage inventory, process orders, and analyze performance—all in one intuitive dashboard. Simplify your store operations today!",
  icons: [
    {
      url: "/logo.svg",
      href: "/logo.svg"
    }
  ]
}

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          disableTransitionOnChange
          storageKey={THEME_STORAGE_KEY}
        >
          <ThemeColorProvider>{children}</ThemeColorProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

export default RootLayout
