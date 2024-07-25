import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from '@/components/ui/pagination'
import { cn } from '@/lib/utils'

interface Props {
  page: number
  pageSize: number
  pathname?: string
  isLink?: boolean
  onClick?: (page: number) => void
}

/**
Với range = 2 áp dụng cho khoảng cách đầu, cuối và xung quanh current_page

[1] 2 3 ... 19 20
1 [2] 3 4 ... 19 20
1 2 [3] 4 5 ... 19 20
1 2 3 [4] 5 6 ... 19 20
1 2 3 4 [5] 6 7 ... 19 20

1 2 ... 4 5 [6] 8 9 ... 19 20

1 2 ...13 14 [15] 16 17 ... 19 20


1 2 ... 14 15 [16] 17 18 19 20
1 2 ... 15 16 [17] 18 19 20
1 2 ... 16 17 [18] 19 20
1 2 ... 17 18 [19] 20
1 2 ... 18 19 [20]
 */

const RANGE = 2

export default function AutoPagination({ page, pageSize, pathname = '/', isLink = true, onClick }: Props) {
  const renderPagination = () => {
    let dotAfter = false
    let dotBefore = false

    const renderDotBefore = (index: number) => {
      if (!dotBefore) {
        dotBefore = true
        return (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )
      }
      return null
    }

    const renderDotAfter = (index: number) => {
      if (!dotAfter) {
        dotAfter = true
        return (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )
      }
      return null
    }

    return Array(pageSize)
      .fill(0)
      .map((_, index) => {
        const pageNumber = index + 1

        // Điều kiện để return về ...
        if (page <= RANGE * 2 + 1 && pageNumber > page + RANGE && pageNumber < pageSize - RANGE + 1) {
          return renderDotAfter(index)
        } else if (page > RANGE * 2 + 1 && page < pageSize - RANGE * 2) {
          if (pageNumber < page - RANGE && pageNumber > RANGE) {
            return renderDotBefore(index)
          } else if (pageNumber > page + RANGE && pageNumber < pageSize - RANGE + 1) {
            return renderDotAfter(index)
          }
        } else if (page >= pageSize - RANGE * 2 && pageNumber > RANGE && pageNumber < page - RANGE) {
          return renderDotBefore(index)
        }

        return (
          <PaginationItem key={index}>
            {isLink ? (
              <PaginationLink
                href={{
                  pathname,
                  query: {
                    page: pageNumber
                  }
                }}
                isActive={pageNumber === page}
              >
                {pageNumber}
              </PaginationLink>
            ) : (
              <Button
                className="w-9 h-9 p-0"
                variant={pageNumber === page ? 'outline' : 'ghost'}
                onClick={() => onClick?.(pageNumber)}
              >
                {pageNumber}
              </Button>
            )}
          </PaginationItem>
        )
      })
  }
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          {isLink ? (
            <PaginationPrevious
              href={{
                pathname,
                query: {
                  page: page - 1
                }
              }}
              className={cn({
                'cursor-not-allowed': page === 1
              })}
              onClick={(e) => {
                if (page === 1) {
                  e.preventDefault()
                }
              }}
            />
          ) : (
            <Button
              disabled={page === 1}
              variant="ghost"
              className={cn('h-9 p-0 pr-2', {
                'cursor-not-allowed': page === 1
              })}
              onClick={() => onClick?.(page - 1)}
            >
              <ChevronLeft />
              Prev
            </Button>
          )}
        </PaginationItem>

        {renderPagination()}

        <PaginationItem>
          {isLink ? (
            <PaginationNext
              href={{
                pathname,
                query: {
                  page: page + 1
                }
              }}
              className={cn({
                'cursor-not-allowed': page === pageSize
              })}
              onClick={(e) => {
                if (page === pageSize) {
                  e.preventDefault()
                }
              }}
            />
          ) : (
            <Button
              disabled={page === pageSize}
              variant="ghost"
              className={cn('h-9 p-0 pl-2', {
                'cursor-not-allowed': page === pageSize
              })}
              onClick={() => onClick?.(page + 1)}
            >
              Next
              <ChevronRight />
            </Button>
          )}
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}
