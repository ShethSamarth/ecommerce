"use client"

import { ThemeProviderProps, useTheme } from "next-themes"
import { createContext, useContext, useEffect, useState } from "react"

import { ThemeColors, themes } from "@/constants/theme"
import { THEME_COLOR_STORAGE_KEY } from "@/constants/values"

type ThemeColorContextProps = {
  themeColor: ThemeColors
  setThemeColor: React.Dispatch<React.SetStateAction<ThemeColors>>
}

const ThemeColorContext = createContext<ThemeColorContextProps>(
  {} as ThemeColorContextProps
)

export const ThemeColorProvider = ({ children }: ThemeProviderProps) => {
  const { theme } = useTheme()

  const [isMounted, setIsMounted] = useState(false)

  const getThemeColor = () => {
    try {
      return (
        (localStorage.getItem(THEME_COLOR_STORAGE_KEY) as ThemeColors) || "Zinc"
      )
    } catch {
      return "Zinc" as ThemeColors
    }
  }

  const setGlobalColorTheme = (
    themeMode: "light" | "dark",
    color: ThemeColors
  ) => {
    const theme = themes[color][themeMode] as {
      [key: string]: string
    }

    for (const key in theme) {
      const value = theme[key]
      document.documentElement.style.setProperty(`--${key}`, value)
    }
  }

  const [themeColor, setThemeColor] = useState<ThemeColors>(
    getThemeColor() as ThemeColors
  )

  useEffect(() => {
    localStorage.setItem(THEME_COLOR_STORAGE_KEY, themeColor)
    setGlobalColorTheme(theme as "light" | "dark", themeColor)

    if (!isMounted) {
      setIsMounted(true)
    }
  }, [themeColor, theme, isMounted])

  if (!isMounted) return null

  return (
    <ThemeColorContext.Provider value={{ themeColor, setThemeColor }}>
      {children}
    </ThemeColorContext.Provider>
  )
}

export const useThemeColorContext = () => {
  return useContext(ThemeColorContext)
}
