import { useQuery } from '@tanstack/react-query'

import { QueryKeys } from '@/constants'
import { tableService } from '@/services'

export const useTableListQuery = () => {
  return useQuery({
    queryKey: [QueryKeys.TABLE_LIST],
    queryFn: tableService.getAll
  })
}
