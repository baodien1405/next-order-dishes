import { cookies } from 'next/headers'

import { authService } from '@/services'

export async function POST() {
  const cookieStore = cookies()

  const accessToken = cookieStore.get('accessToken')?.value
  const refreshToken = cookieStore.get('refreshToken')?.value

  cookieStore.delete('accessToken')
  cookieStore.delete('refreshToken')

  if (!accessToken || !refreshToken) {
    return Response.json(
      {
        message: 'Not received access token or refresh token'
      },
      {
        status: 200
      }
    )
  }

  try {
    const response = await authService.sLogout({ accessToken, refreshToken })

    return Response.json(response.payload)
  } catch (error) {
    return Response.json(
      { message: 'Something went wrong when call API to server backend' },
      {
        status: 200
      }
    )
  }
}
