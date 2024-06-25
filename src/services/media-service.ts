import { http } from '@/lib/http'
import { UploadImageResType } from '@/schemaValidations/media.schema'

export const mediaService = {
  upload(formData: FormData) {
    return http.post<UploadImageResType>('/media/upload', formData)
  }
}
