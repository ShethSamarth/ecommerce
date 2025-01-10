import { resolve } from "path"
import { readFileSync } from "fs"

export const loadTemplate = (
  templateName: EmailTemplates,
  variables: Record<string, string>
) => {
  const templatePath = resolve(__dirname, `${templateName}.html`)
  let template = readFileSync(templatePath, "utf-8")

  // Replace placeholders with actual values
  Object.entries(variables).forEach(([key, value]) => {
    template = template.replace(new RegExp(`{{${key}}}`, "g"), value)
  })

  return template
}
