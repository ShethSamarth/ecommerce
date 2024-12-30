"use client"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { ThemeColors } from "@/constants/theme"
import { useThemeColorContext } from "@/components/providers/theme-color-provider"

type ThemeColorToogleProps = {
  className?: string
}

type ColorOptionProps = {
  name: ThemeColors
  color: string
}

export const ThemeColorToogle = ({ className }: ThemeColorToogleProps) => {
  const { themeColor, setThemeColor } = useThemeColorContext()

  const themeColorOptions: ColorOptionProps[] = [
    { name: "Zinc", color: "bg-zinc-600" },
    { name: "Red", color: "bg-red-600" },
    { name: "Rose", color: "bg-rose-600" },
    { name: "Orange", color: "bg-orange-600" },
    { name: "Green", color: "bg-green-600" },
    { name: "Blue", color: "bg-blue-600" },
    { name: "Yellow", color: "bg-yellow-600" },
    { name: "Violet", color: "bg-violet-600" }
  ]

  return (
    <Select
      defaultValue={themeColor}
      onValueChange={(value) => setThemeColor(value as ThemeColors)}
    >
      <SelectTrigger className={className}>
        <SelectValue placeholder="Select Theme Color" />
      </SelectTrigger>

      <SelectContent>
        {themeColorOptions.map(({ name, color }) => (
          <SelectItem key={name} value={name}>
            <div className="flex items-center space-x-3">
              <span className={cn("size-5 shrink-0 rounded-full", color)} />
              <p className="text-sm">{name}</p>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
