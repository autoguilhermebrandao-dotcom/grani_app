'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Transaction, Category } from '@/lib/supabase/types'

export interface TransactionFilters {
  month?: number
  year?: number
  type?: 'income' | 'expense' | 'all'
  category?: string
}

export function useTransactions(filters: TransactionFilters = {}) {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  const fetch = useCallback(async () => {
    setLoading(true)
    setError(null)

    let query = supabase
      .from('transactions')
      .select('*')
      .order('date', { ascending: false })

    const now = new Date()
    const year = filters.year ?? now.getFullYear()
    const month = filters.month ?? now.getMonth() + 1

    const startDate = `${year}-${String(month).padStart(2, '0')}-01`
    const endDate = new Date(year, month, 0)
    const endDateStr = `${year}-${String(month).padStart(2, '0')}-${String(endDate.getDate()).padStart(2, '0')}`

    query = query.gte('date', startDate).lte('date', endDateStr)

    if (filters.type && filters.type !== 'all') {
      query = query.eq('type', filters.type)
    }

    if (filters.category) {
      query = query.eq('category', filters.category as Category)
    }

    const { data, error } = await query

    if (error) {
      setError(error.message)
    } else {
      setTransactions(data ?? [])
    }

    setLoading(false)
  }, [filters.month, filters.year, filters.type, filters.category])

  useEffect(() => {
    fetch()
  }, [fetch])

  return { transactions, loading, error, refetch: fetch }
}
