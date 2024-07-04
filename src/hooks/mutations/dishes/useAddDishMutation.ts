import { useMutation, useQueryClient } from '@tanstack/react-query'

import { MutationKeys, QueryKeys } from '@/constants'
import { dishService } from '@/services'

export const useAddDishMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: [MutationKeys.ADD_DISH],
    mutationFn: dishService.add,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.DISH_LIST]
      })
    }
  })
}
