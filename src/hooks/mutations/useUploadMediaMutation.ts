import { useMutation } from '@tanstack/react-query'

import { MutationKeys } from '@/constants'
import { mediaService } from '@/services'

export const useUploadMediaMutation = () => {
  return useMutation({
    mutationKey: [MutationKeys.UPLOAD_MEDIA],
    mutationFn: mediaService.upload
  })
}
