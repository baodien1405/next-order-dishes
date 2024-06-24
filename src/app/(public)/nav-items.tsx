'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

import { getAccessTokenFromLS } from '@/lib/common'

const menuItems = [
  {
    title: 'Món ăn',
    href: '/menu'
  },
  {
    title: 'Đơn hàng',
    href: '/orders',
    authRequired: true
  },
  {
    title: 'Đăng nhập',
    href: '/login',
    authRequired: false
  },
  {
    title: 'Quản lý',
    href: '/manage/dashboard',
    authRequired: true
  }
]

export default function NavItems({ className }: { className?: string }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    setIsAuthenticated(Boolean(getAccessTokenFromLS()))
  }, [])

  return menuItems.map((item) => {
    if ((item.authRequired === true && !isAuthenticated) || (item.authRequired === false && isAuthenticated)) {
      return null
    }

    return (
      <Link href={item.href} key={item.href} className={className}>
        {item.title}
      </Link>
    )
  })
}
