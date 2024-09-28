'use client'

import { ReactNode } from 'react'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { useRouter } from 'next/navigation'

export function Modal({ children }: { children: ReactNode }) {
  const router = useRouter()

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) router.back()
      }}
    >
      <DialogContent className="m-h-full overflow-auto">{children}</DialogContent>
    </Dialog>
  )
}
