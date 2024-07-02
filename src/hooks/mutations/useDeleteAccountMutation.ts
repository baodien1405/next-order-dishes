import { useMutation, useQueryClient } from '@tanstack/react-query'

import { accountService } from '@/services'
import { MutationKeys, QueryKeys } from '@/constants'

export const useDeleteAccountMutation = () => {
  return useMutation({
    mutationKey: [MutationKeys.DELETE_ACCOUNT],
    mutationFn: accountService.delete,
    onSuccess: () => {
      const queryClient = useQueryClient()

      queryClient.invalidateQueries({
        queryKey: [QueryKeys.ACCOUNT_LIST]
      })
    }
  })
}
