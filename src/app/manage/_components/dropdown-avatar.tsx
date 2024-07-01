'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { handleErrorApi } from '@/lib/utils'
import { useLogoutMutation } from '@/hooks'
import { path } from '@/constants'
import { useAccountMeQuery } from '@/hooks'
import { useAppContext } from '@/providers'

export function DropdownAvatar() {
  const router = useRouter()
  const { setIsAuth } = useAppContext()
  const logoutMutation = useLogoutMutation()
  const { data } = useAccountMeQuery()
  const profile = data?.payload.data

  const handleLogout = async () => {
    if (logoutMutation.isPending) return

    try {
      await logoutMutation.mutateAsync()
      setIsAuth(false)
      router.push(path.HOME)
    } catch (error) {
      handleErrorApi({ error })
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="overflow-hidden rounded-full">
          <Avatar>
            <AvatarImage src={profile?.avatar ?? undefined} alt={profile?.name} />
            <AvatarFallback>{profile?.name.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>{profile?.name}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href={'/manage/setting'} className="cursor-pointer">
            Cài đặt
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>Hỗ trợ</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>Đăng xuất</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
