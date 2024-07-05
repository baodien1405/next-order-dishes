import { useQuery } from '@tanstack/react-query'

import { QueryKeys } from '@/constants'
import { tableService } from '@/services'

export const useTableDetailQuery = (tableId: number) => {
  return useQuery({
    queryKey: [QueryKeys.TABLE_DETAIL, tableId],
    queryFn: () => tableService.get(tableId),
    enabled: Boolean(tableId)
  })
}
