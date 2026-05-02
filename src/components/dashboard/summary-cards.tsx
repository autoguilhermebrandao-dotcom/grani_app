'use client'

import { Card, CardContent } from '@/components/ui/card'
import { TrendingUp, TrendingDown, Wallet } from 'lucide-react'
import { formatCurrency } from '@/lib/utils/currency'
import type { Transaction } from '@/lib/supabase/types'

interface SummaryCardsProps {
  transactions: Transaction[]
}

export function SummaryCards({ transactions }: SummaryCardsProps) {
  const income = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)

  const expense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0)

  const balance = income - expense

  const cards = [
    {
      label: 'Receitas',
      value: income,
      icon: TrendingUp,
      color: 'text-emerald-600 dark:text-emerald-400',
      bg: 'bg-emerald-50 dark:bg-emerald-950',
      border: 'border-emerald-100 dark:border-emerald-900',
    },
    {
      label: 'Despesas',
      value: expense,
      icon: TrendingDown,
      color: 'text-red-500 dark:text-red-400',
      bg: 'bg-red-50 dark:bg-red-950',
      border: 'border-red-100 dark:border-red-900',
    },
    {
      label: 'Saldo',
      value: balance,
      icon: Wallet,
      color: balance >= 0 ? 'text-blue-600 dark:text-blue-400' : 'text-red-500 dark:text-red-400',
      bg: balance >= 0 ? 'bg-blue-50 dark:bg-blue-950' : 'bg-red-50 dark:bg-red-950',
      border: balance >= 0 ? 'border-blue-100 dark:border-blue-900' : 'border-red-100 dark:border-red-900',
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {cards.map(({ label, value, icon: Icon, color, bg, border }) => (
        <Card key={label} className={`border ${border} shadow-none dark:bg-slate-900`}>
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</span>
              <div className={`p-2 rounded-lg ${bg}`}>
                <Icon className={`w-4 h-4 ${color}`} />
              </div>
            </div>
            <p className={`text-2xl font-bold ${color}`}>
              {formatCurrency(value)}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
