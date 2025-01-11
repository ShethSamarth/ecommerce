import { compare, hash } from "bcryptjs"

export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = parseInt(process.env.BCRYPT_SALT!) || 10
  return await hash(password, saltRounds)
}

export const comparePasswords = async (
  plainPassword: string,
  hashedPassword: string
): Promise<boolean> => {
  return await compare(plainPassword, hashedPassword)
}
