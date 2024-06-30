import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

import { path } from '@/constants'

const privatePaths = ['/manage']
const authPaths = ['/login']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const accessToken = request.cookies.get('accessToken')?.value
  const refreshToken = request.cookies.get('refreshToken')?.value

  if (privatePaths.some((path) => pathname.startsWith(path)) && !refreshToken) {
    return NextResponse.redirect(new URL(path.LOGIN, request.url))
  }

  if (authPaths.some((path) => pathname.startsWith(path)) && refreshToken) {
    return NextResponse.redirect(new URL(path.HOME, request.url))
  }

  if (privatePaths.some((path) => pathname.startsWith(path)) && !accessToken && refreshToken) {
    const url = new URL(path.REFRESH_TOKEN, request.url)

    url.searchParams.set('refreshToken', refreshToken)
    url.searchParams.set('redirect', pathname)

    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/manage/:path*', '/login']
}
