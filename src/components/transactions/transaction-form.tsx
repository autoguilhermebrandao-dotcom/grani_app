'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Loader2 } from 'lucide-react'
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES } from '@/lib/supabase/types'
import type { Transaction, TransactionType, Category } from '@/lib/supabase/types'

interface TransactionFormProps {
  transaction?: Transaction
  onSuccess: () => void
  onCancel: () => void
}

export function TransactionForm({ transaction, onSuccess, onCancel }: TransactionFormProps) {
  const supabase = createClient()
  const isEditing = !!transaction

  const [type, setType] = useState<TransactionType>(transaction?.type ?? 'expense')
  const [amount, setAmount] = useState(transaction ? String(transaction.amount) : '')
  const [description, setDescription] = useState(transaction?.description ?? '')
  const [category, setCategory] = useState<Category | ''>(transaction?.category ?? '')
  const [date, setDate] = useState(transaction?.date ?? new Date().toISOString().split('T')[0])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const categories = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES

  function handleTypeChange(value: TransactionType) {
    setType(value)
    setCategory('')
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    const parsedAmount = parseFloat(amount.replace(',', '.'))
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setError('Valor inválido.')
      return
    }
    if (!category) {
      setError('Selecione uma categoria.')
      return
    }

    setLoading(true)

    if (isEditing) {
      const { error } = await supabase
        .from('transactions')
        .update({ type, amount: parsedAmount, description, category, date })
        .eq('id', transaction.id)

      if (error) { setError(error.message); setLoading(false); return }
    } else {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setError('Sessão expirada.'); setLoading(false); return }

      const { error } = await supabase.from('transactions').insert({
        user_id: user.id,
        type,
        amount: parsedAmount,
        description,
        category,
        date,
      })

      if (error) { setError(error.message); setLoading(false); return }
    }

    onSuccess()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Type toggle */}
      <div className="flex rounded-lg overflow-hidden border border-slate-200">
        {(['expense', 'income'] as TransactionType[]).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => handleTypeChange(t)}
            className={`flex-1 py-2 text-sm font-medium transition-colors ${
              type === t
                ? t === 'income'
                  ? 'bg-emerald-500 text-white'
                  : 'bg-red-500 text-white'
                : 'bg-white text-slate-500 hover:bg-slate-50'
            }`}
          >
            {t === 'income' ? 'Receita' : 'Despesa'}
          </button>
        ))}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="amount">Valor (R$)</Label>
        <Input
          id="amount"
          type="text"
          inputMode="decimal"
          placeholder="0,00"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="description">Descrição</Label>
        <Input
          id="description"
          type="text"
          placeholder="Ex: Supermercado"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="category">Categoria</Label>
        <Select value={category} onValueChange={(v) => setCategory(v as Category)}>
          <SelectTrigger>
            <SelectValue placeholder="Selecionar categoria" />
          </SelectTrigger>
          <SelectContent>
            {categories.map(({ value, label }) => (
              <SelectItem key={value} value={value}>{label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="date">Data</Label>
        <Input
          id="date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
      </div>

      {error && (
        <p className="text-sm text-red-500 bg-red-50 px-3 py-2 rounded-md">{error}</p>
      )}

      <div className="flex gap-2 pt-1">
        <Button type="button" variant="outline" className="flex-1" onClick={onCancel} disabled={loading}>
          Cancelar
        </Button>
        <Button
          type="submit"
          className={`flex-1 ${type === 'income' ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-red-500 hover:bg-red-600'}`}
          disabled={loading}
        >
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isEditing ? 'Salvar' : 'Adicionar'}
        </Button>
      </div>
    </form>
  )
}
