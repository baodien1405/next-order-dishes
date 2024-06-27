import { accountService } from '@/services'
import { cookies } from 'next/headers'

export default async function DashboardPage() {
  const cookieStore = cookies()
  const accessToken = cookieStore.get('accessToken')?.value
  let name = ''

  try {
    const response = await accountService.sMe(accessToken as string)
    name = response.payload.data.name
  } catch (error: any) {
    if (error.digest?.includes('NEXT_REDIRECT')) {
      throw error
    }
  }

  return <div>Dashboard {name}</div>
}
