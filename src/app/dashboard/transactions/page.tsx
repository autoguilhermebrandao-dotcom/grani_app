'use client'

import { useState } from 'react'
import { useTransactions } from '@/hooks/use-transactions'
import { MonthPicker } from '@/components/dashboard/month-picker'
import { AddTransactionButton } from '@/components/transactions/add-transaction-button'
import { TransactionsTable } from '@/components/transactions/transactions-table'
import { TransactionFiltersBar } from '@/components/transactions/transaction-filters-bar'
import type { Category } from '@/lib/supabase/types'

export default function TransactionsPage() {
  const now = new Date()
  const [month, setMonth] = useState(now.getMonth() + 1)
  const [year, setYear] = useState(now.getFullYear())
  const [typeFilter, setTypeFilter] = useState<'all' | 'income' | 'expense'>('all')
  const [categoryFilter, setCategoryFilter] = useState<Category | ''>('')

  const { transactions, loading, refetch } = useTransactions({
    month,
    year,
    type: typeFilter,
    category: categoryFilter || undefined,
  })

  return (
    <div className="space-y-6 pb-20 md:pb-0">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">Transações</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Gerencie suas receitas e despesas</p>
        </div>
        <div className="flex items-center gap-3">
          <MonthPicker month={month} year={year} onChange={(m, y) => { setMonth(m); setYear(y) }} />
          <AddTransactionButton onSuccess={refetch} />
        </div>
      </div>

      <TransactionFiltersBar
        typeFilter={typeFilter}
        categoryFilter={categoryFilter}
        onTypeChange={setTypeFilter}
        onCategoryChange={setCategoryFilter}
      />

      <TransactionsTable transactions={transactions} loading={loading} onRefetch={refetch} />
    </div>
  )
}
