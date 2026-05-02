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
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
      border: 'border-emerald-100',
    },
    {
      label: 'Despesas',
      value: expense,
      icon: TrendingDown,
      color: 'text-red-500',
      bg: 'bg-red-50',
      border: 'border-red-100',
    },
    {
      label: 'Saldo',
      value: balance,
      icon: Wallet,
      color: balance >= 0 ? 'text-blue-600' : 'text-red-500',
      bg: balance >= 0 ? 'bg-blue-50' : 'bg-red-50',
      border: balance >= 0 ? 'border-blue-100' : 'border-red-100',
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {cards.map(({ label, value, icon: Icon, color, bg, border }) => (
        <Card key={label} className={`border ${border} shadow-none`}>
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-slate-500">{label}</span>
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
