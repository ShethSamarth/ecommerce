import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toogle"
import { ThemeColorToogle } from "@/components/theme-color-toogle"

const Home = () => {
  return (
    <div className="flex gap-x-5 p-5">
      <ThemeColorToogle className="w-48" />
      <ModeToggle />
      <Button>Current Theme</Button>
    </div>
  )
}

export default Home
