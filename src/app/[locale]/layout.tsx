import { Inter as FontSans } from 'next/font/google'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, unstable_setRequestLocale } from 'next-intl/server'
import { getTranslations } from 'next-intl/server'
import NextTopLoader from 'nextjs-toploader'

import { cn } from '@/lib/utils'
import { AppProvider, ThemeProvider } from '@/providers'
import { Toaster } from '@/components/ui/toaster'
import { routing } from '@/i18n/routing'

import './globals.css'

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans'
})

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: 'Brand' })

  return {
    title: {
      template: `%s | ${t('title')}`,
      default: t('defaultTitle')
    }
  }
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default async function RootLayout({
  children,
  params: { locale }
}: Readonly<{
  children: React.ReactNode
  params: { locale: string }
}>) {
  unstable_setRequestLocale(locale)
  const messages = await getMessages()

  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={cn('min-h-screen bg-background font-sans antialiased', fontSans.variable)}
      >
        <NextTopLoader showSpinner={false} color="hsl(var(--foreground))" />
        <NextIntlClientProvider messages={messages}>
          <AppProvider>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
              {children}
              <Toaster />
            </ThemeProvider>
          </AppProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
