'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { TransactionForm } from './transaction-form'

export function AddTransactionButton({ onSuccess }: { onSuccess: () => void }) {
  const [open, setOpen] = useState(false)

  function handleSuccess() {
    setOpen(false)
    onSuccess()
  }

  return (
    <>
      <Button
        className="bg-emerald-500 hover:bg-emerald-600 gap-1.5"
        onClick={() => setOpen(true)}
      >
        <Plus className="w-4 h-4" />
        Nova transação
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Nova Transação</DialogTitle>
          </DialogHeader>
          <TransactionForm onSuccess={handleSuccess} onCancel={() => setOpen(false)} />
        </DialogContent>
      </Dialog>
    </>
  )
}
