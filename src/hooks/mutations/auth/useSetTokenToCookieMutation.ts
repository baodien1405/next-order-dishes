import { useMutation } from '@tanstack/react-query'

import { authService } from '@/services'
import { MutationKeys } from '@/constants'

export const useSetTokenToCookieMutation = () => {
  return useMutation({
    mutationKey: [MutationKeys.SET_TOKEN_TO_COOKIE],
    mutationFn: authService.setTokenToCookie
  })
}
