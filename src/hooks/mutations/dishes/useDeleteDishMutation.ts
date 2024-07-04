import { useMutation, useQueryClient } from '@tanstack/react-query'

import { MutationKeys, QueryKeys } from '@/constants'
import { dishService } from '@/services'

export const useDeleteDishMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: [MutationKeys.DELETE_DISH],
    mutationFn: dishService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.DISH_LIST]
      })
    }
  })
}
