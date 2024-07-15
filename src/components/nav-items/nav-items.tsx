'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { useAppContext } from '@/providers'
import { path, Role } from '@/constants'
import { RoleType } from '@/types'
import { cn, handleErrorApi } from '@/lib/utils'
import { useLogoutMutation } from '@/hooks'

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
    title: 'Quản lý',
    href: path.MANAGE_DASHBOARD,
    role: [Role.Owner, Role.Employee]
  }
]

export default function NavItems({ className }: { className?: string }) {
  const router = useRouter()
  const { role, setRole } = useAppContext()
  const logoutMutation = useLogoutMutation()

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync()
      setRole()
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
        <div className={cn(className, 'cursor-pointer')} onClick={handleLogout}>
          Đăng xuất
        </div>
      )}
    </>
  )
}
