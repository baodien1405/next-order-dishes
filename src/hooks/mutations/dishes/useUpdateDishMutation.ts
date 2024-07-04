import { useMutation, useQueryClient } from '@tanstack/react-query'

import { MutationKeys, QueryKeys } from '@/constants'
import { UpdateDishBodyType } from '@/schemaValidations/dish.schema'
import { dishService } from '@/services'

export const useUpdateDishMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: [MutationKeys.UPDATE_DISH],
    mutationFn: ({ id, ...body }: UpdateDishBodyType & { id: number }) => dishService.update(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.DISH_LIST],
        exact: true
      })
    }
  })
}
