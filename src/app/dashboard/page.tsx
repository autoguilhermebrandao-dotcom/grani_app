'use client'

import { useState } from 'react'
import { useTransactions } from '@/hooks/use-transactions'
import { SummaryCards } from '@/components/dashboard/summary-cards'
import { ExpenseChart } from '@/components/dashboard/expense-chart'
import { MonthPicker } from '@/components/dashboard/month-picker'
import { RecentTransactions } from '@/components/transactions/recent-transactions'
import { AddTransactionButton } from '@/components/transactions/add-transaction-button'
import { IncomeExpenseChart } from '@/components/dashboard/income-expense-chart'

export default function DashboardPage() {
  const now = new Date()
  const [month, setMonth] = useState(now.getMonth() + 1)
  const [year, setYear] = useState(now.getFullYear())

  const { transactions, loading, refetch } = useTransactions({ month, year })

  return (
    <div className="space-y-6 pb-20 md:pb-0">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-sm text-slate-500">Visão geral das suas finanças</p>
        </div>
        <div className="flex items-center gap-3">
          <MonthPicker month={month} year={year} onChange={(m, y) => { setMonth(m); setYear(y) }} />
          <AddTransactionButton onSuccess={refetch} />
        </div>
      </div>

      <SummaryCards transactions={transactions} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ExpenseChart transactions={transactions} />
        <IncomeExpenseChart transactions={transactions} month={month} year={year} />
      </div>

      <RecentTransactions transactions={transactions} loading={loading} onRefetch={refetch} />
    </div>
  )
}
