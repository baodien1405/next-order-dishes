import { useMutation } from '@tanstack/react-query'

import { accountService } from '@/services'
import { MutationKeys } from '@/constants'

export const useUpdateMeMutation = () => {
  return useMutation({
    mutationKey: [MutationKeys.UPDATE_ME],
    mutationFn: accountService.updateMe
  })
}
