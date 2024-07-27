import { useQuery } from '@tanstack/react-query'

import { QueryKeys } from '@/constants'
import { indicatorsService } from '@/services'
import { DashboardIndicatorQueryParamsType } from '@/schemaValidations/indicator.schema'

export const useDashboardIndicatorsQuery = (queryParams: DashboardIndicatorQueryParamsType) => {
  return useQuery({
    queryKey: [QueryKeys.DASHBOARD_INDICATORS, queryParams],
    queryFn: () => indicatorsService.getDashboardIndicators(queryParams)
  })
}
