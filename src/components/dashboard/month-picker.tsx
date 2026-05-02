'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getMonthName } from '@/lib/utils/currency'

interface MonthPickerProps {
  month: number
  year: number
  onChange: (month: number, year: number) => void
}

export function MonthPicker({ month, year, onChange }: MonthPickerProps) {
  function prev() {
    if (month === 1) onChange(12, year - 1)
    else onChange(month - 1, year)
  }

  function next() {
    const now = new Date()
    const isCurrentOrFuture =
      year > now.getFullYear() ||
      (year === now.getFullYear() && month >= now.getMonth() + 1)
    if (isCurrentOrFuture) return
    if (month === 12) onChange(1, year + 1)
    else onChange(month + 1, year)
  }

  const now = new Date()
  const isCurrent = year === now.getFullYear() && month === now.getMonth() + 1

  return (
    <div className="flex items-center gap-2">
      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={prev}>
        <ChevronLeft className="w-4 h-4" />
      </Button>
      <span className="text-sm font-medium text-slate-700 capitalize min-w-[140px] text-center">
        {getMonthName(month, year)}
      </span>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={next}
        disabled={isCurrent}
      >
        <ChevronRight className="w-4 h-4" />
      </Button>
    </div>
  )
}
