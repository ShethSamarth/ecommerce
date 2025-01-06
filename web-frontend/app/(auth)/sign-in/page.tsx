import { LoginForm } from "../components/login-form"

const SignInPage = () => {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-background p-6 md:p-10">
      <main className="w-full max-w-sm">
        <LoginForm />
      </main>
    </div>
  )
}

export default SignInPage
