'use client'

import { Upload } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useMemo, useState } from 'react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/components/ui/use-toast'
import { UpdateMeBody, UpdateMeBodyType } from '@/schemaValidations/account.schema'
import { Form, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useAccountMeQuery, useUpdateMeMutation, useUploadMediaMutation } from '@/hooks'
import { handleErrorApi } from '@/lib/client-utils'

export function UpdateProfileForm() {
  const toast = useToast()
  const [file, setFile] = useState<File | null>(null)

  const form = useForm<UpdateMeBodyType>({
    resolver: zodResolver(UpdateMeBody),
    defaultValues: {
      name: '',
      avatar: undefined
    }
  })

  const { data, refetch } = useAccountMeQuery()
  const uploadMediaMutation = useUploadMediaMutation()
  const updateMeMutation = useUpdateMeMutation()

  useEffect(() => {
    if (data) {
      const { avatar, name } = data.payload.data

      form.reset({
        name,
        avatar: avatar ?? undefined
      })
    }
  }, [data, form])

  const watchAvatar = form.watch('avatar')
  const watchName = form.watch('name')

  const previewAvatar = useMemo(() => {
    if (file) {
      return URL.createObjectURL(file)
    }

    return watchAvatar
  }, [watchAvatar, file])

  const onSubmit = async (formValues: UpdateMeBodyType) => {
    if (updateMeMutation.isPending) return

    try {
      let payload = formValues

      if (file) {
        const formData = new FormData()
        formData.append('file', file)

        const result = await uploadMediaMutation.mutateAsync(formData)
        const imageUrl = result.payload.data

        payload = {
          ...formValues,
          avatar: imageUrl
        }
      }

      const response = await updateMeMutation.mutateAsync(payload)
      toast.toast({ description: response.payload.message })
      refetch()
    } catch (error) {
      handleErrorApi({ error, setError: form.setError })
    }
  }

  return (
    <Form {...form}>
      <form noValidate className="grid auto-rows-max items-start gap-4 md:gap-8" onSubmit={form.handleSubmit(onSubmit)}>
        <Card x-chunk="dashboard-07-chunk-0">
          <CardHeader>
            <CardTitle>Thông tin cá nhân</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6">
              <FormField
                control={form.control}
                name="avatar"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex gap-2 items-start justify-start">
                      <Avatar className="aspect-square w-[100px] h-[100px] rounded-md object-cover">
                        <AvatarImage src={previewAvatar} />
                        <AvatarFallback className="rounded-none">{watchName}</AvatarFallback>
                      </Avatar>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        id="profile-image"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) {
                            setFile(file)
                            field.onChange(`http://localhost:3000/${field.name}`)
                          }
                        }}
                      />

                      <label
                        htmlFor="profile-image"
                        className="flex aspect-square w-[100px] items-center justify-center rounded-md border border-dashed hover:cursor-pointer"
                      >
                        <Upload className="h-4 w-4 text-muted-foreground" />
                        <span className="sr-only">Upload</span>
                      </label>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid gap-3">
                      <Label htmlFor="name">Tên</Label>
                      <Input id="name" type="text" className="w-full" {...field} />
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />

              <div className=" items-center gap-2 md:ml-auto flex">
                <Button variant="outline" size="sm" type="reset">
                  Hủy
                </Button>
                <Button size="sm" type="submit">
                  Lưu thông tin
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </form>
    </Form>
  )
}
