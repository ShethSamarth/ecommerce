import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export const middleware = (request: NextRequest) => {
  const accessToken = request.cookies.get("accessToken")

  if (request.url.endsWith("/sign-in") && !!accessToken) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  if (!request.url.endsWith("/sign-in") && !accessToken) {
    return NextResponse.redirect(new URL("/sign-in", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)"
  ]
}
