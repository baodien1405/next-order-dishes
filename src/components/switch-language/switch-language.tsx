'use client'

import { useLocale, useTranslations } from 'next-intl'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

import { Locale, locales } from '@/i18n/config'
import { setUserLocale } from '@/i18n/locale'

export default function SwitchLanguage() {
  const t = useTranslations('SwitchLanguage')
  const locale = useLocale()

  return (
    <Select value={locale} onValueChange={(value) => setUserLocale(value as Locale)}>
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
