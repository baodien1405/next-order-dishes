'use client'

import { Link, useRouter } from '@/i18n/routing'
import { useTranslations } from 'next-intl'

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
    title: 'home',
    href: path.HOME
  },
  {
    title: 'menu',
    href: path.GUEST_MENU,
    role: [Role.Guest]
  },
  {
    title: 'login',
    href: path.LOGIN,
    hideWhenLogin: true
  },
  {
    title: 'orders',
    href: path.GUEST_ORDERS,
    role: [Role.Guest]
  },
  {
    title: 'manage',
    href: path.MANAGE_DASHBOARD,
    role: [Role.Owner, Role.Employee]
  }
]

export default function NavItems({ className }: { className?: string }) {
  const t = useTranslations('NavItem')
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
              {t(item.title as any)}
            </Link>
          )
        }

        return null
      })}

      {role && (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <div className={cn(className, 'cursor-pointer')}>{t('logout')}</div>
          </AlertDialogTrigger>

          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{t('logout_dialog.logout_question')}</AlertDialogTitle>
              <AlertDialogDescription>{t('logout_dialog.logout_confirm')}</AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter>
              <AlertDialogCancel>{t('logout_dialog.logout_cancel')}</AlertDialogCancel>
              <AlertDialogAction onClick={handleLogout}>OK</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  )
}
