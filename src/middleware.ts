import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtDecode } from 'jwt-decode'

import { Role, path } from '@/constants'
import { TokenPayload } from '@/types'

const managePaths = ['/manage']
const guestPaths = ['/guest']
const onlyOwnerPaths = ['/manage/accounts']
const privatePaths = ['/manage', '/guest']
const authPaths = ['/login']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const accessToken = request.cookies.get('accessToken')?.value
  const refreshToken = request.cookies.get('refreshToken')?.value

  if (privatePaths.some((path) => pathname.startsWith(path)) && !refreshToken) {
    const url = new URL(path.LOGIN, request.url)

    url.searchParams.set('clearTokens', 'true')

    return NextResponse.redirect(url)
  }

  if (refreshToken) {
    if (authPaths.some((path) => pathname.startsWith(path))) {
      return NextResponse.redirect(new URL(path.HOME, request.url))
    }

    if (privatePaths.some((path) => pathname.startsWith(path)) && !accessToken) {
      const url = new URL(path.REFRESH_TOKEN, request.url)

      url.searchParams.set('refreshToken', refreshToken)
      url.searchParams.set('redirect', pathname)

      return NextResponse.redirect(url)
    }

    const role = jwtDecode<TokenPayload>(refreshToken).role

    const isGuestGoToManagePath = role === Role.Guest && managePaths.some((path) => pathname.startsWith(path))
    const isNotGuestGoToGuestPath = role !== Role.Guest && guestPaths.some((path) => pathname.startsWith(path))
    const isNotOwnerGoToOwnerPath = role !== Role.Owner && onlyOwnerPaths.some((path) => pathname.startsWith(path))

    if (isGuestGoToManagePath || isNotGuestGoToGuestPath || isNotOwnerGoToOwnerPath) {
      return NextResponse.redirect(new URL(path.HOME, request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/manage/:path*', '/guest/:path*', '/login']
}
