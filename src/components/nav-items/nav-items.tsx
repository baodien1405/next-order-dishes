'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog'

import { path, Role } from '@/constants'
import { RoleType } from '@/types'
import { cn, handleErrorApi } from '@/lib/utils'
import { useAppStore, useLogoutMutation } from '@/hooks'

interface MenuItem {
  title: string
  href: string
  role?: RoleType[]
  hideWhenLogin?: boolean
}

const menuItems: MenuItem[] = [
  {
    title: 'Trang chủ',
    href: path.HOME
  },
  {
    title: 'Menu',
    href: path.GUEST_MENU,
    role: [Role.Guest]
  },
  {
    title: 'Đăng nhập',
    href: path.LOGIN,
    hideWhenLogin: true
  },
  {
    title: 'Đơn hàng',
    href: path.GUEST_ORDERS,
    role: [Role.Guest]
  },
  {
    title: 'Quản lý',
    href: path.MANAGE_DASHBOARD,
    role: [Role.Owner, Role.Employee]
  }
]

export default function NavItems({ className }: { className?: string }) {
  const router = useRouter()
  const setRole = useAppStore((state) => state.setRole)
  const role = useAppStore((state) => state.role)
  const disconnectSocket = useAppStore((state) => state.disconnectSocket)
  const logoutMutation = useLogoutMutation()

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync()
      setRole(undefined)
      disconnectSocket()
      router.push(path.HOME)
    } catch (error) {
      handleErrorApi({ error })
    }
  }

  return (
    <>
      {menuItems.map((item) => {
        const isAuth = role && item.role && item.role.includes(role)
        const canShow = (item.role === undefined && !item.hideWhenLogin) || (!role && item.hideWhenLogin)

        if (isAuth || canShow) {
          return (
            <Link href={item.href} key={item.href} className={className}>
              {item.title}
            </Link>
          )
        }

        return null
      })}

      {role && (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <div className={cn(className, 'cursor-pointer')}>Đăng xuất</div>
          </AlertDialogTrigger>

          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Bạn có muốn đăng xuất không?</AlertDialogTitle>
              <AlertDialogDescription>Việc đăng xuất có thể làm mất hoá đơn của bạn</AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter>
              <AlertDialogCancel>Thoát</AlertDialogCancel>
              <AlertDialogAction onClick={handleLogout}>OK</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  )
}
