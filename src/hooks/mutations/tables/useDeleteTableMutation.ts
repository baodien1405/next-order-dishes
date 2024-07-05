import { useMutation, useQueryClient } from '@tanstack/react-query'

import { MutationKeys, QueryKeys } from '@/constants'
import { tableService } from '@/services'

export const useDeleteTableMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: [MutationKeys.DELETE_TABLE],
    mutationFn: tableService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.TABLE_LIST]
      })
    }
  })
}
