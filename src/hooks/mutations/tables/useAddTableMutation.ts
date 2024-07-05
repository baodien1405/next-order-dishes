import { useMutation, useQueryClient } from '@tanstack/react-query'

import { MutationKeys, QueryKeys } from '@/constants'
import { tableService } from '@/services'

export const useAddTableMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: [MutationKeys.ADD_TABLE],
    mutationFn: tableService.add,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.TABLE_LIST]
      })
    }
  })
}
