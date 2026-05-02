export type TransactionType = 'income' | 'expense'

export type Category =
  | 'salary'
  | 'freelance'
  | 'investment'
  | 'other_income'
  | 'housing'
  | 'food'
  | 'transport'
  | 'health'
  | 'education'
  | 'entertainment'
  | 'clothing'
  | 'other_expense'

export type Transaction = {
  id: string
  user_id: string
  type: TransactionType
  amount: number
  description: string
  category: Category
  date: string
  created_at: string
}

export type TransactionInsert = {
  user_id: string
  type: TransactionType
  amount: number
  description: string
  category: Category
  date: string
}

export type TransactionUpdate = {
  type?: TransactionType
  amount?: number
  description?: string
  category?: Category
  date?: string
}

export type Database = {
  public: {
    Tables: {
      transactions: {
        Row: Transaction
        Insert: TransactionInsert
        Update: TransactionUpdate
        Relationships: never[]
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
  }
}

export const INCOME_CATEGORIES: { value: Category; label: string }[] = [
  { value: 'salary', label: 'Salário' },
  { value: 'freelance', label: 'Freelance' },
  { value: 'investment', label: 'Investimentos' },
  { value: 'other_income', label: 'Outras Receitas' },
]

export const EXPENSE_CATEGORIES: { value: Category; label: string }[] = [
  { value: 'housing', label: 'Moradia' },
  { value: 'food', label: 'Alimentação' },
  { value: 'transport', label: 'Transporte' },
  { value: 'health', label: 'Saúde' },
  { value: 'education', label: 'Educação' },
  { value: 'entertainment', label: 'Lazer' },
  { value: 'clothing', label: 'Vestuário' },
  { value: 'other_expense', label: 'Outras Despesas' },
]

export const ALL_CATEGORIES = [...INCOME_CATEGORIES, ...EXPENSE_CATEGORIES]

export function getCategoryLabel(category: Category): string {
  return ALL_CATEGORIES.find((c) => c.value === category)?.label ?? category
}

export const CATEGORY_COLORS: Record<Category, string> = {
  salary: '#4ade80',
  freelance: '#34d399',
  investment: '#2dd4bf',
  other_income: '#a3e635',
  housing: '#f87171',
  food: '#fb923c',
  transport: '#fbbf24',
  health: '#e879f9',
  education: '#818cf8',
  entertainment: '#38bdf8',
  clothing: '#f472b6',
  other_expense: '#94a3b8',
}
