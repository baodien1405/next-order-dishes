import { jwtDecode } from 'jwt-decode'
import { cookies } from 'next/headers'

import { HttpError } from '@/lib/http'
import { GuestLoginBodyType } from '@/schemaValidations/guest.schema'
import { guestService } from '@/services'

export async function POST(request: Request) {
  const body = (await request.json()) as GuestLoginBodyType
  const cookieStore = cookies()

  try {
    const { payload } = await guestService.sLogin(body)

    const { accessToken, refreshToken } = payload.data
    const decodeAccessToken = jwtDecode(accessToken) as { exp: number }
    const decodeRefreshToken = jwtDecode(refreshToken) as { exp: number }

    cookieStore.set('accessToken', accessToken, {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      secure: true,
      expires: decodeAccessToken.exp * 1000
    })

    cookieStore.set('refreshToken', refreshToken, {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      secure: true,
      expires: decodeRefreshToken.exp * 1000
    })

    return Response.json(payload)
  } catch (error) {
    if (error instanceof HttpError) {
      return Response.json(error.payload, {
        status: error.status
      })
    } else {
      return Response.json(
        { message: 'Something went wrong' },
        {
          status: 500
        }
      )
    }
  }
}
