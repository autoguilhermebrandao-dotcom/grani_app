'use client'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ALL_CATEGORIES } from '@/lib/supabase/types'
import type { Category } from '@/lib/supabase/types'

interface TransactionFiltersBarProps {
  typeFilter: 'all' | 'income' | 'expense'
  categoryFilter: Category | ''
  onTypeChange: (value: 'all' | 'income' | 'expense') => void
  onCategoryChange: (value: Category | '') => void
}

export function TransactionFiltersBar({
  typeFilter,
  categoryFilter,
  onTypeChange,
  onCategoryChange,
}: TransactionFiltersBarProps) {
  return (
    <div className="flex flex-wrap gap-3">
      <Select value={typeFilter} onValueChange={(v) => onTypeChange(v as 'all' | 'income' | 'expense')}>
        <SelectTrigger className="w-40 bg-white">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos os tipos</SelectItem>
          <SelectItem value="income">Receitas</SelectItem>
          <SelectItem value="expense">Despesas</SelectItem>
        </SelectContent>
      </Select>

      <Select value={categoryFilter || 'all'} onValueChange={(v) => onCategoryChange(v === 'all' ? '' : v as Category)}>
        <SelectTrigger className="w-52 bg-white">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todas as categorias</SelectItem>
          {ALL_CATEGORIES.map(({ value, label }) => (
            <SelectItem key={value} value={value}>{label}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
