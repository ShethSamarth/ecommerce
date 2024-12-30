"use client"

import { useTheme } from "next-themes"
import { Moon, Sun } from "lucide-react"

import { Button } from "@/components/ui/button"

export const ModeToggle = () => {
  const { theme, setTheme } = useTheme()

  return (
    <Button
      size="icon"
      variant="outline"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
    >
      <span className="sr-only">Toggle theme</span>
      {theme === "light" ? (
        <Sun className="size-5" />
      ) : (
        <Moon className="size-5" />
      )}
    </Button>
  )
}
