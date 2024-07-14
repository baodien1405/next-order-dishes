'use client'

import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Form, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { GuestLoginBody, GuestLoginBodyType } from '@/schemaValidations/guest.schema'
import { path } from '@/constants'
import { handleErrorApi } from '@/lib/utils'
import { useGuestLoginMutation } from '@/hooks'
import { useAppContext } from '@/providers'

export function GuestLoginForm() {
  const router = useRouter()
  const params = useParams()
  const searchParams = useSearchParams()
  const guestLoginMutation = useGuestLoginMutation()
  const { setRole } = useAppContext()
  const tableNumber = Number(params.number)
  const token = searchParams.get('token')

  const form = useForm<GuestLoginBodyType>({
    resolver: zodResolver(GuestLoginBody),
    defaultValues: {
      name: '',
      token: token ?? '',
      tableNumber
    }
  })

  useEffect(() => {
    if (!token) {
      router.push(path.HOME)
    }
  }, [token, router])

  const handleGuestLogin = async (formValues: GuestLoginBodyType) => {
    try {
      const response = await guestLoginMutation.mutateAsync(formValues)
      setRole(response.payload.data.guest.role)
      router.push(path.GUEST_MENU)
    } catch (error) {
      handleErrorApi({ error, setError: form.setError })
    }
  }

  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Đăng nhập gọi món</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            className="space-y-2 max-w-[600px] flex-shrink-0 w-full"
            noValidate
            onSubmit={form.handleSubmit(handleGuestLogin, console.log)}
          >
            <div className="grid gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid gap-2">
                      <Label htmlFor="name">Tên khách hàng</Label>
                      <Input id="name" type="text" required {...field} />
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full">
                Đăng nhập
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
