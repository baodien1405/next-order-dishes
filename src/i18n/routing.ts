import { createSharedPathnamesNavigation } from 'next-intl/navigation'
import { defineRouting } from 'next-intl/routing'

import { defaultLocale, locales } from '@/i18n/config'

export const routing = defineRouting({
  locales: locales,
  defaultLocale: defaultLocale
})

export const { Link, redirect, usePathname, useRouter } = createSharedPathnamesNavigation(routing)
