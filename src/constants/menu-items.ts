import { Home, Salad, ShoppingCart, Table, Users2 } from 'lucide-react'

export const menuItems = [
  {
    title: 'Dashboard',
    Icon: Home,
    href: '/manage/dashboard'
  },
  {
    title: 'Đơn hàng',
    Icon: ShoppingCart,
    href: '/manage/orders'
  },
  {
    title: 'Bàn ăn',
    Icon: Table,
    href: '/manage/tables'
  },
  {
    title: 'Món ăn',
    Icon: Salad,
    href: '/manage/dishes'
  },
  {
    title: 'Nhân viên',
    Icon: Users2,
    href: '/manage/accounts'
  }
]
