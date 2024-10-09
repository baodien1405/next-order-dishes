'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useRouter } from '@/i18n/routing'
import { useTranslations } from 'next-intl'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Form, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { LoginBody, LoginBodyType } from '@/schemaValidations/auth.schema'
import { useAppStore, useLoginMutation } from '@/hooks'
import { generateSocketInstance, handleErrorApi } from '@/lib/utils'
import { path } from '@/constants'
import { envConfig } from '@/configs'
import { SearchParamsLoader, useSearchParamsLoader } from '@/components/search-params-loader'
import { Loader2 } from 'lucide-react'

const getOauthGoogleUrl = () => {
  const rootUrl = 'https://accounts.google.com/o/oauth2/v2/auth'
  const options = {
    redirect_uri: envConfig.NEXT_PUBLIC_GOOGLE_AUTHORIZED_REDIRECT_URI,
    client_id: envConfig.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    access_type: 'offline',
    response_type: 'code',
    prompt: 'consent',
    scope: ['https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email'].join(
      ' '
    )
  }
  const qs = new URLSearchParams(options)
  return `${rootUrl}?${qs.toString()}`
}

const googleOauthUrl = getOauthGoogleUrl()

export function LoginForm() {
  const t = useTranslations('LoginPage')
  const errorMessageT = useTranslations('ErrorMessage')
  const router = useRouter()
  const { searchParams, setSearchParams } = useSearchParamsLoader()
  const clearTokens = searchParams?.get('clearTokens')
  const setSocket = useAppStore((state) => state.setSocket)
  const setRole = useAppStore((state) => state.setRole)
  const loginMutation = useLoginMutation()
  const form = useForm<LoginBodyType>({
    resolver: zodResolver(LoginBody),
    defaultValues: {
      email: '',
      password: ''
    }
  })

  useEffect(() => {
    if (clearTokens) {
      setRole(undefined)
    }
  }, [clearTokens, setRole])

  const onSubmit = async (payload: LoginBodyType) => {
    if (loginMutation.isPending) return

    try {
      const response = await loginMutation.mutateAsync(payload)

      setRole(response.payload.data.account.role)
      router.push(path.MANAGE_DASHBOARD)
      setSocket(generateSocketInstance(response.payload.data.accessToken))
    } catch (error) {
      handleErrorApi({
        error
      })
    }
  }

  return (
    <Card className="mx-auto max-w-sm">
      <SearchParamsLoader onParamsReceived={setSearchParams} />
      <CardHeader>
        <CardTitle className="text-2xl">{t('title')}</CardTitle>
        <CardDescription>{t('card_description')}</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            className="space-y-2 max-w-[600px] flex-shrink-0 w-full"
            noValidate
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <div className="grid gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field, fieldState: { error } }) => (
                  <FormItem>
                    <div className="grid gap-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" placeholder="m@example.com" required {...field} />
                      <FormMessage>{Boolean(error?.message) && errorMessageT(error?.message as any)}</FormMessage>
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field, fieldState: { error } }) => (
                  <FormItem>
                    <div className="grid gap-2">
                      <div className="flex items-center">
                        <Label htmlFor="password">Password</Label>
                      </div>
                      <Input id="password" type="password" required {...field} />
                      <FormMessage>{Boolean(error?.message) && errorMessageT(error?.message as any)}</FormMessage>
                    </div>
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">
                {loginMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {t('button_login')}
              </Button>

              <Link href={googleOauthUrl}>
                <Button variant="outline" className="w-full" type="button">
                  {t('login_with_google')}
                </Button>
              </Link>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
