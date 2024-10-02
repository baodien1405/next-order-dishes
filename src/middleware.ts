import { NextResponse, type NextRequest } from 'next/server'
import { jwtDecode } from 'jwt-decode'
import createMiddleware from 'next-intl/middleware'

import { Role, path } from '@/constants'
import { TokenPayload } from '@/types'
import { defaultLocale, locales } from '@/i18n/config'

const managePaths = ['/vi/manage', '/en/manage']
const guestPaths = ['/vi/guest', '/en/guest']
const onlyOwnerPaths = ['/vi/manage/accounts', '/en/manage/accounts']
const privatePaths = [...managePaths, ...guestPaths]
const authPaths = ['/vi/login', '/en/login']

export function middleware(request: NextRequest) {
  const handleI18nRouting = createMiddleware({
    locales,
    defaultLocale
  })

  const response = handleI18nRouting(request)
  const { pathname } = request.nextUrl
  const accessToken = request.cookies.get('accessToken')?.value
  const refreshToken = request.cookies.get('refreshToken')?.value
  const locale = request.cookies.get('NEXT_LOCALE')?.value ?? defaultLocale

  if (privatePaths.some((path) => pathname.startsWith(path)) && !refreshToken) {
    const url = new URL(`/${locale}${path.LOGIN}`, request.url)
    url.searchParams.set('clearTokens', 'true')

    return NextResponse.redirect(url)
    // response.headers.set('x-middleware-rewrite', url.toString())
    // return response
  }

  if (refreshToken) {
    if (authPaths.some((path) => pathname.startsWith(path))) {
      return NextResponse.redirect(new URL(`/${locale}`, request.url))
      // response.headers.set('x-middleware-rewrite', new URL(path.HOME, request.url).toString())
      // return response
    }

    if (privatePaths.some((path) => pathname.startsWith(path)) && !accessToken) {
      const url = new URL(`/${locale}${path.REFRESH_TOKEN}`, request.url)

      url.searchParams.set('refreshToken', refreshToken)
      url.searchParams.set('redirect', pathname)

      return NextResponse.redirect(url)
      // response.headers.set('x-middleware-rewrite', url.toString())
      // return response
    }

    const role = jwtDecode<TokenPayload>(refreshToken).role

    const isGuestGoToManagePath = role === Role.Guest && managePaths.some((path) => pathname.startsWith(path))
    const isNotGuestGoToGuestPath = role !== Role.Guest && guestPaths.some((path) => pathname.startsWith(path))
    const isNotOwnerGoToOwnerPath = role !== Role.Owner && onlyOwnerPaths.some((path) => pathname.startsWith(path))

    if (isGuestGoToManagePath || isNotGuestGoToGuestPath || isNotOwnerGoToOwnerPath) {
      return NextResponse.redirect(new URL(`/${locale}`, request.url))
      // response.headers.set('x-middleware-rewrite', new URL(path.HOME, request.url).toString())
      // return response
    }

    return response
  }

  return response
}

export const config = {
  matcher: ['/', '/(vi|en)/:path*', '/((?!_next|_vercel|.*\\..*).*)']
}
