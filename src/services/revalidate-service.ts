import { http } from '@/lib/http'

export const revalidateService = {
  revalidateTag(tag: string) {
    return http.get<{ now: number; revalidated: boolean }>(`/api/revalidate?tag=${tag}`, {
      baseUrl: ''
    })
  }
}
