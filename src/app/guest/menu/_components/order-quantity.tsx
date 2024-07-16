import { Minus, Plus } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface OrderQuantityProps {
  value: number
  onChange: (value: number) => void
}

export function OrderQuantity({ value, onChange }: OrderQuantityProps) {
  return (
    <div className="flex gap-1 ">
      <Button className="h-6 w-6 p-0" disabled={value === 0} onClick={() => onChange(value - 1)}>
        <Minus className="w-3 h-3" />
      </Button>

      <Input
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        className="h-6 p-1 w-8 text-center"
        value={value}
        onChange={(e) => {
          const value = Number(e.target.value)
          if (isNaN(value)) return

          onChange(value)
        }}
      />

      <Button className="h-6 w-6 p-0" onClick={() => onChange(value + 1)}>
        <Plus className="w-3 h-3" />
      </Button>
    </div>
  )
}
