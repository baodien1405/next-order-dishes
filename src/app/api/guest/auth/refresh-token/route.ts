import { jwtDecode } from 'jwt-decode'
import { cookies } from 'next/headers'

import { guestService } from '@/services'

export async function POST() {
  const cookieStore = cookies()
  const refreshToken = cookieStore.get('refreshToken')?.value

  if (!refreshToken) {
    return Response.json(
      { message: 'Not found refresh token' },
      {
        status: 401
      }
    )
  }

  try {
    const { payload } = await guestService.sRefreshToken({ refreshToken })

    const decodeAccessToken = jwtDecode(payload.data.accessToken) as { exp: number }
    const decodeRefreshToken = jwtDecode(payload.data.refreshToken) as { exp: number }

    cookieStore.set('accessToken', payload.data.accessToken, {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      secure: true,
      expires: decodeAccessToken.exp * 1000
    })

    cookieStore.set('refreshToken', payload.data.refreshToken, {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      secure: true,
      expires: decodeRefreshToken.exp * 1000
    })

    return Response.json(payload)
  } catch (error: any) {
    return Response.json(
      { message: error?.message || 'Something went wrong' },
      {
        status: 401
      }
    )
  }
}
