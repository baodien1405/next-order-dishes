import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AccountTable } from '@/app/[locale]/manage/accounts/_components'
import { Locale } from '@/i18n/config'
import { envConfig } from '@/configs'

type Props = {
  params: { locale: Locale }
  searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const t = await getTranslations({
    locale: params.locale,
    namespace: 'ManageAccounts'
  })
  const url = envConfig.NEXT_PUBLIC_URL + `/${params.locale}/manage/accounts`
  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical: url
    },
    robots: {
      index: false
    }
  }
}

export default async function AccountsPage() {
  const t = await getTranslations('ManageAccounts')

  return (
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <div className="space-y-2">
        <Card x-chunk="dashboard-06-chunk-0">
          <CardHeader>
            <CardTitle>{t('card_title')}</CardTitle>
            <CardDescription>{t('description')}</CardDescription>
          </CardHeader>
          <CardContent>
            <AccountTable />
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
