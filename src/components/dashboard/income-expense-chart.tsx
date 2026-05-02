'use client'

import { useMemo } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency } from '@/lib/utils/currency'
import type { Transaction } from '@/lib/supabase/types'

interface IncomeExpenseChartProps {
  transactions: Transaction[]
  month: number
  year: number
}

export function IncomeExpenseChart({ transactions, month, year }: IncomeExpenseChartProps) {
  const data = useMemo(() => {
    const daysInMonth = new Date(year, month, 0).getDate()
    const weeks: { name: string; Receitas: number; Despesas: number }[] = []

    const weekSize = Math.ceil(daysInMonth / 4)
    for (let i = 0; i < 4; i++) {
      const start = i * weekSize + 1
      const end = Math.min((i + 1) * weekSize, daysInMonth)
      const weekTransactions = transactions.filter((t) => {
        const day = parseInt(t.date.split('-')[2])
        return day >= start && day <= end
      })
      weeks.push({
        name: `${start}–${end}`,
        Receitas: weekTransactions.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0),
        Despesas: weekTransactions.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0),
      })
    }

    return weeks
  }, [transactions, month, year])

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold text-slate-900">Receitas vs Despesas</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={data} barSize={22} barGap={4}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <YAxis tickFormatter={(v) => `R$${v >= 1000 ? `${(v / 1000).toFixed(1)}k` : v}`} tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} width={56} />
            <Tooltip
              formatter={(value) => [formatCurrency(Number(value)), '']}
              contentStyle={{ border: 'none', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '13px' }}
            />
            <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }} />
            <Bar dataKey="Receitas" fill="#4ade80" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Despesas" fill="#f87171" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
