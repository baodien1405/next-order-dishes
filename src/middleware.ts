import type { NextRequest } from 'next/server'
import { jwtDecode } from 'jwt-decode'
import createMiddleware from 'next-intl/middleware'

import { Role, path } from '@/constants'
import { TokenPayload } from '@/types'
import { defaultLocale, locales } from '@/i18n/config'

const managePaths = ['/en/manage', '/vi/manage']
const guestPaths = ['/en/guest', '/vi/guest']
const onlyOwnerPaths = ['/en/manage/accounts', '/vi/manage/accounts']
const privatePaths = [...managePaths, ...guestPaths]
const authPaths = ['/en/login', '/vi/login']

export function middleware(request: NextRequest) {
  const handleI18nRouting = createMiddleware({
    locales,
    defaultLocale
  })

  const response = handleI18nRouting(request)
  const { pathname } = request.nextUrl
  const accessToken = request.cookies.get('accessToken')?.value
  const refreshToken = request.cookies.get('refreshToken')?.value

  if (privatePaths.some((path) => pathname.startsWith(path)) && !refreshToken) {
    const url = new URL(path.LOGIN, request.url)

    url.searchParams.set('clearTokens', 'true')
    response.headers.set('x-middleware-rewrite', url.toString())

    return response
  }

  if (refreshToken) {
    if (authPaths.some((path) => pathname.startsWith(path))) {
      response.headers.set('x-middleware-rewrite', new URL(path.HOME, request.url).toString())

      return response
    }

    if (privatePaths.some((path) => pathname.startsWith(path)) && !accessToken) {
      const url = new URL(path.REFRESH_TOKEN, request.url)

      url.searchParams.set('refreshToken', refreshToken)
      url.searchParams.set('redirect', pathname)
      response.headers.set('x-middleware-rewrite', url.toString())

      return response
    }

    const role = jwtDecode<TokenPayload>(refreshToken).role

    const isGuestGoToManagePath = role === Role.Guest && managePaths.some((path) => pathname.startsWith(path))
    const isNotGuestGoToGuestPath = role !== Role.Guest && guestPaths.some((path) => pathname.startsWith(path))
    const isNotOwnerGoToOwnerPath = role !== Role.Owner && onlyOwnerPaths.some((path) => pathname.startsWith(path))

    if (isGuestGoToManagePath || isNotGuestGoToGuestPath || isNotOwnerGoToOwnerPath) {
      response.headers.set('x-middleware-rewrite', new URL(path.HOME, request.url).toString())

      return response
    }

    return response
  }

  return response
}

export const config = {
  matcher: ['/', '/(vi|en)/:path*', '/((?!_next|_vercel|.*\\..*).*)']
}
