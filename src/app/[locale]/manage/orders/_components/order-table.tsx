'use client'

import {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable
} from '@tanstack/react-table'
import { Check, ChevronsUpDown } from 'lucide-react'
import { createContext, useEffect, useState } from 'react'
import { endOfDay, format, startOfDay } from 'date-fns'

import AutoPagination from '@/components/auto-pagination'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Command, CommandGroup, CommandItem, CommandList } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { OrderStatusValues } from '@/constants/type'
import { getVietnameseOrderStatus, handleErrorApi } from '@/lib/client-utils'
import { GetOrdersResType, PayGuestOrdersResType, UpdateOrderResType } from '@/schemaValidations/order.schema'
import { cn } from '@/lib/client-utils'
import { useAppStore, useOrderListQuery, useTableListQuery, useUpdateOrderMutation } from '@/hooks'
import { useToast } from '@/components/ui/use-toast'
import { GuestCreateOrdersResType } from '@/schemaValidations/guest.schema'
import { useOrderService } from '@/app/[locale]/manage/orders/_hooks'
import orderTableColumns from '@/app/[locale]/manage/orders/_components/order-table-columns'
import { EditOrder } from '@/app/[locale]/manage/orders/_components/edit-order'
import { AddOrder } from '@/app/[locale]/manage/orders/_components/add-order'
import { OrderStatics } from '@/app/[locale]/manage/orders/_components/order-statics'
import { TableSkeleton } from '@/app/[locale]/manage/orders/_components/table-skeleton'
import { useSearchParamsLoader } from '@/components/search-params-loader'

export const OrderTableContext = createContext({
  setOrderIdEdit: (value: number | undefined) => {},
  orderIdEdit: undefined as number | undefined,
  changeStatus: (payload: {
    orderId: number
    dishId: number
    status: (typeof OrderStatusValues)[number]
    quantity: number
  }) => {},
  orderObjectByGuestId: {} as OrderObjectByGuestID
})

export type StatusCountObject = Record<(typeof OrderStatusValues)[number], number>
export type Statics = {
  status: StatusCountObject
  table: Record<number, Record<number, StatusCountObject>>
}
export type OrderObjectByGuestID = Record<number, GetOrdersResType['data']>
export type ServingGuestByTableNumber = Record<number, OrderObjectByGuestID>

const PAGE_SIZE = 10
const initFromDate = startOfDay(new Date())
const initToDate = endOfDay(new Date())

export function OrderTable() {
  const toast = useToast()
  const socket = useAppStore((state) => state.socket)
  const { searchParams } = useSearchParamsLoader()
  const [openStatusFilter, setOpenStatusFilter] = useState(false)
  const [fromDate, setFromDate] = useState(initFromDate)
  const [toDate, setToDate] = useState(initToDate)
  const page = searchParams?.get('page') ? Number(searchParams?.get('page')) : 1
  const pageIndex = page - 1
  const [orderIdEdit, setOrderIdEdit] = useState<number | undefined>()

  const updateOrderMutation = useUpdateOrderMutation()
  const orderListQuery = useOrderListQuery({
    fromDate,
    toDate
  })
  const refetchOrderList = orderListQuery.refetch
  const tableListQuery = useTableListQuery()

  const orderList = orderListQuery.data?.payload.data || []
  const tableList = tableListQuery.data?.payload.data || []
  const tableListSortedByNumber = tableList.sort((a, b) => a.number - b.number)
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})
  const [pagination, setPagination] = useState({
    pageIndex, // Gía trị mặc định ban đầu, không có ý nghĩa khi data được fetch bất đồng bộ
    pageSize: PAGE_SIZE //default page size
  })

  const { statics, orderObjectByGuestId, servingGuestByTableNumber } = useOrderService(orderList)

  const changeStatus = async (body: {
    orderId: number
    dishId: number
    status: (typeof OrderStatusValues)[number]
    quantity: number
  }) => {
    if (updateOrderMutation.isPending) return

    try {
      await updateOrderMutation.mutateAsync({
        ...body,
        id: body.orderId
      })
    } catch (error) {
      handleErrorApi({
        error
      })
    }
  }

  const table = useReactTable({
    data: orderList,
    columns: orderTableColumns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    autoResetPageIndex: false,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination
    }
  })

  useEffect(() => {
    table.setPagination({
      pageIndex,
      pageSize: PAGE_SIZE
    })
  }, [table, pageIndex])

  useEffect(() => {
    if (socket?.connected) {
      onConnect()
    }

    function onConnect() {
      console.log(socket?.id)
    }

    function onDisconnect() {
      console.log('disconnected')
    }

    function refetch() {
      const now = new Date()
      if (now >= fromDate && now <= toDate) {
        refetchOrderList()
      }
    }

    function onOrderUpdate(data: UpdateOrderResType['data']) {
      const {
        dishSnapshot: { name },
        quantity,
        status
      } = data

      toast.toast({
        description: `Món ${name} (SL: ${quantity}) vừa được cập nhật sang trạng thái "${getVietnameseOrderStatus(
          status
        )}`
      })

      refetch()
    }

    function onNewOrder(data: GuestCreateOrdersResType['data']) {
      const { guest } = data[0]

      toast.toast({
        description: `${guest?.name} tại bàn ${guest?.tableNumber} vừa đặt ${data.length} đơn`
      })

      refetch()
    }

    function onPayment(data: PayGuestOrdersResType['data']) {
      const { guest } = data[0]

      toast.toast({
        description: `${guest?.name} tại bàn ${guest?.tableNumber} thanh toán thành công ${data.length} đơn`
      })

      refetch()
    }

    socket?.on('update-order', onOrderUpdate)
    socket?.on('new-order', onNewOrder)
    socket?.on('payment', onPayment)
    socket?.on('connect', onConnect)
    socket?.on('disconnect', onDisconnect)

    return () => {
      socket?.off('connect', onConnect)
      socket?.off('disconnect', onDisconnect)
      socket?.off('update-order', onOrderUpdate)
      socket?.off('new-order', onNewOrder)
      socket?.off('payment', onPayment)
    }
  }, [fromDate, refetchOrderList, toDate, toast, socket])

  const resetDateFilter = () => {
    setFromDate(initFromDate)
    setToDate(initToDate)
  }

  return (
    <OrderTableContext.Provider
      value={{
        orderIdEdit,
        setOrderIdEdit,
        changeStatus,
        orderObjectByGuestId
      }}
    >
      <div className="w-full">
        <EditOrder id={orderIdEdit} setId={setOrderIdEdit} onSubmitSuccess={() => {}} />
        <div className=" flex items-center">
          <div className="flex flex-wrap gap-2">
            <div className="flex items-center">
              <span className="mr-2">Từ</span>
              <Input
                type="datetime-local"
                placeholder="Từ ngày"
                className="text-sm"
                value={format(fromDate, 'yyyy-MM-dd HH:mm').replace(' ', 'T')}
                onChange={(event) => setFromDate(new Date(event.target.value))}
              />
            </div>
            <div className="flex items-center">
              <span className="mr-2">Đến</span>
              <Input
                type="datetime-local"
                placeholder="Đến ngày"
                value={format(toDate, 'yyyy-MM-dd HH:mm').replace(' ', 'T')}
                onChange={(event) => setToDate(new Date(event.target.value))}
              />
            </div>
            <Button className="" variant={'outline'} onClick={resetDateFilter}>
              Reset
            </Button>
          </div>
          <div className="ml-auto">
            <AddOrder />
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-4 py-4">
          <Input
            placeholder="Tên khách"
            value={(table.getColumn('guestName')?.getFilterValue() as string) ?? ''}
            onChange={(event) => table.getColumn('guestName')?.setFilterValue(event.target.value)}
            className="max-w-[100px]"
          />
          <Input
            placeholder="Số bàn"
            value={(table.getColumn('tableNumber')?.getFilterValue() as string) ?? ''}
            onChange={(event) => table.getColumn('tableNumber')?.setFilterValue(event.target.value)}
            className="max-w-[80px]"
          />
          <Popover open={openStatusFilter} onOpenChange={setOpenStatusFilter}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={openStatusFilter}
                className="w-[150px] text-sm justify-between"
              >
                {table.getColumn('status')?.getFilterValue()
                  ? getVietnameseOrderStatus(
                      table.getColumn('status')?.getFilterValue() as (typeof OrderStatusValues)[number]
                    )
                  : 'Trạng thái'}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
              <Command>
                <CommandGroup>
                  <CommandList>
                    {OrderStatusValues.map((status) => (
                      <CommandItem
                        key={status}
                        value={status}
                        onSelect={(currentValue) => {
                          table
                            .getColumn('status')
                            ?.setFilterValue(
                              currentValue === table.getColumn('status')?.getFilterValue() ? '' : currentValue
                            )
                          setOpenStatusFilter(false)
                        }}
                      >
                        <Check
                          className={cn(
                            'mr-2 h-4 w-4',
                            table.getColumn('status')?.getFilterValue() === status ? 'opacity-100' : 'opacity-0'
                          )}
                        />
                        {getVietnameseOrderStatus(status)}
                      </CommandItem>
                    ))}
                  </CommandList>
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
        <OrderStatics
          statics={statics}
          tableList={tableListSortedByNumber}
          servingGuestByTableNumber={servingGuestByTableNumber}
        />
        {orderListQuery.isPending && <TableSkeleton />}
        {!orderListQuery.isPending && (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(header.column.columnDef.header, header.getContext())}
                        </TableHead>
                      )
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={orderTableColumns.length} className="h-24 text-center">
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
        <div className="flex items-center justify-end space-x-2 py-4">
          <div className="text-xs text-muted-foreground py-4 flex-1 ">
            Hiển thị <strong>{table.getPaginationRowModel().rows.length}</strong> trong{' '}
            <strong>{orderList.length}</strong> kết quả
          </div>
          <div>
            <AutoPagination
              page={table.getState().pagination.pageIndex + 1}
              pageSize={table.getPageCount()}
              pathname="/manage/orders"
            />
          </div>
        </div>
      </div>
    </OrderTableContext.Provider>
  )
}
