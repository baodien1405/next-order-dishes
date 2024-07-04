import { useQuery } from '@tanstack/react-query'

import { QueryKeys } from '@/constants'
import { dishService } from '@/services'

export const useDishDetailQuery = (dishId: number) => {
  return useQuery({
    queryKey: [QueryKeys.DISH_DETAIL, dishId],
    queryFn: () => dishService.get(dishId),
    enabled: Boolean(dishId)
  })
}
