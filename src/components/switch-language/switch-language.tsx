'use client'

import { useLocale, useTranslations } from 'next-intl'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

import { Locale, locales } from '@/i18n/config'
import { useParams, usePathname, useRouter, useSearchParams } from 'next/navigation'

export default function SwitchLanguage() {
  const t = useTranslations('SwitchLanguage')
  const locale = useLocale()
  const pathname = usePathname()
  const router = useRouter()
  const params = useParams()
  const searchParams = useSearchParams()

  const handleLanguageChange = (value: string) => {
    const locale = params.locale as Locale
    const newPathname = pathname.replace(`/${locale}`, `/${value}`)
    const fullUrl = `${newPathname}?${searchParams.toString()}`

    router.replace(fullUrl)
    router.refresh()
  }

  return (
    <Select value={locale} onValueChange={handleLanguageChange}>
      <SelectTrigger className="w-[140px]">
        <SelectValue placeholder={t('title')} />
      </SelectTrigger>

      <SelectContent>
        {locales.map((locale) => (
          <SelectItem key={locale} value={locale}>
            {t(locale)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
