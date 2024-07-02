import { useMutation } from '@tanstack/react-query'

import { authService } from '@/services'
import { MutationKeys } from '@/constants'

export const useLoginMutation = () => {
  return useMutation({
    mutationKey: [MutationKeys.LOGIN],
    mutationFn: authService.login
  })
}
