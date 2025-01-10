import { createTransport } from "nodemailer"

import { loadTemplate } from "../email-templates"

type sendEmailProps = {
  to: string
  subject: string
  template: EmailTemplates
  variables: Record<string, string>
}

const transporter = createTransport({
  host: process.env.SMTP_HOST,
  port: 587,
  secure: false,
  requireTLS: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

export const sendEmail = async ({
  to,
  subject,
  template,
  variables,
}: sendEmailProps) => {
  const html = loadTemplate(template, variables)

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to,
    subject,
    html,
  }

  await transporter.sendMail(mailOptions)
}
