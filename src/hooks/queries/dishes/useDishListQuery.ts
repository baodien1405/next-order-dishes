import { useQuery } from '@tanstack/react-query'

import { QueryKeys } from '@/constants'
import { dishService } from '@/services'

export const useDishListQuery = () => {
  return useQuery({
    queryKey: [QueryKeys.DISH_LIST],
    queryFn: dishService.getAll
  })
}
