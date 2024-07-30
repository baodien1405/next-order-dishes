import { jwtDecode } from 'jwt-decode'
import { cookies } from 'next/headers'

import { HttpError } from '@/lib/http'
import { TokenPayload } from '@/types'

export async function POST(request: Request) {
  const body = (await request.json()) as { accessToken: string; refreshToken: string }
  const cookieStore = cookies()

  try {
    const { accessToken, refreshToken } = body
    const decodeAccessToken = jwtDecode<TokenPayload>(accessToken)
    const decodeRefreshToken = jwtDecode<TokenPayload>(refreshToken)

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

    return Response.json(body)
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
