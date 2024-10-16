import { cookies } from 'next/headers'
import { jwtDecode } from 'jwt-decode'

import { accountService } from '@/services'
import { ChangePasswordV2BodyType } from '@/schemaValidations/account.schema'

export async function PUT(request: Request) {
  const cookieStore = cookies()
  const body = (await request.json()) as ChangePasswordV2BodyType
  const accessToken = cookieStore.get('accessToken')?.value

  if (!accessToken) {
    return Response.json(
      { message: 'Not found accessToken' },
      {
        status: 401
      }
    )
  }

  try {
    const { payload } = await accountService.sChangePasswordV2({ ...body, accessToken })

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
      { message: error?.message ?? 'Something went wrong' },
      {
        status: error?.status ?? 500
      }
    )
  }
}
