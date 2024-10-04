import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { DishTable } from '@/app/[locale]/manage/dishes/_components'

export default function DishesPage() {
  return (
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <div className="space-y-2">
        <Card x-chunk="dashboard-06-chunk-0">
          <CardHeader>
            <CardTitle>Món ăn</CardTitle>
            <CardDescription>Quản lý món ăn</CardDescription>
          </CardHeader>
          <CardContent>
            <DishTable />
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
