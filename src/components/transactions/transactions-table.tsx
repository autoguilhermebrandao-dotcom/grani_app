'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { MoreHorizontal, Pencil, Trash2, ArrowUpCircle, ArrowDownCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { formatCurrency, formatDate } from '@/lib/utils/currency'
import { getCategoryLabel } from '@/lib/supabase/types'
import { TransactionForm } from './transaction-form'
import type { Transaction } from '@/lib/supabase/types'

interface TransactionsTableProps {
  transactions: Transaction[]
  loading: boolean
  onRefetch: () => void
}

export function TransactionsTable({ transactions, loading, onRefetch }: TransactionsTableProps) {
  const supabase = createClient()
  const [editing, setEditing] = useState<Transaction | null>(null)
  const [deleting, setDeleting] = useState<Transaction | null>(null)

  async function handleDelete() {
    if (!deleting) return
    await supabase.from('transactions').delete().eq('id', deleting.id)
    setDeleting(null)
    onRefetch()
  }

  return (
    <>
      <Card className="border-0 shadow-sm dark:bg-slate-900 overflow-hidden">
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center h-48 text-sm text-slate-400">Carregando...</div>
          ) : transactions.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-sm text-slate-400 dark:text-slate-500 gap-2">
              <p>Nenhuma transação encontrada</p>
              <p className="text-xs">Tente ajustar os filtros ou adicionar uma transação</p>
            </div>
          ) : (
            <>
              {/* Desktop table */}
              <div className="hidden md:block">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <TableHead className="text-xs font-medium text-slate-500 dark:text-slate-400 pl-5">Descrição</TableHead>
                      <TableHead className="text-xs font-medium text-slate-500 dark:text-slate-400">Categoria</TableHead>
                      <TableHead className="text-xs font-medium text-slate-500 dark:text-slate-400">Data</TableHead>
                      <TableHead className="text-xs font-medium text-slate-500 dark:text-slate-400">Tipo</TableHead>
                      <TableHead className="text-xs font-medium text-slate-500 dark:text-slate-400 text-right pr-5">Valor</TableHead>
                      <TableHead className="w-12" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.map((t) => (
                      <TableRow key={t.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 border-slate-100 dark:border-slate-800">
                        <TableCell className="font-medium text-slate-800 dark:text-slate-200 pl-5">{t.description}</TableCell>
                        <TableCell className="text-slate-500 dark:text-slate-400 text-sm">{getCategoryLabel(t.category)}</TableCell>
                        <TableCell className="text-slate-500 dark:text-slate-400 text-sm">{formatDate(t.date)}</TableCell>
                        <TableCell>
                          <Badge variant="secondary" className={
                            t.type === 'income'
                              ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50'
                              : 'bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400 hover:bg-red-50'
                          }>
                            {t.type === 'income' ? 'Receita' : 'Despesa'}
                          </Badge>
                        </TableCell>
                        <TableCell className={`text-right font-semibold pr-5 ${t.type === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500 dark:text-red-400'}`}>
                          {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger className="inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
                              <MoreHorizontal className="w-4 h-4" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-36">
                              <DropdownMenuItem onClick={() => setEditing(t)}>
                                <Pencil className="w-3.5 h-3.5 mr-2" /> Editar
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600 focus:text-red-600" onClick={() => setDeleting(t)}>
                                <Trash2 className="w-3.5 h-3.5 mr-2" /> Excluir
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile list */}
              <ul className="md:hidden divide-y divide-slate-50 dark:divide-slate-800">
                {transactions.map((t) => (
                  <li key={t.id} className="flex items-center justify-between px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className={`p-1.5 rounded-full ${t.type === 'income' ? 'bg-emerald-50 dark:bg-emerald-950' : 'bg-red-50 dark:bg-red-950'}`}>
                        {t.type === 'income'
                          ? <ArrowUpCircle className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
                          : <ArrowDownCircle className="w-4 h-4 text-red-500 dark:text-red-400" />
                        }
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{t.description}</p>
                        <p className="text-xs text-slate-400 dark:text-slate-500">{getCategoryLabel(t.category)} · {formatDate(t.date)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-semibold ${t.type === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500 dark:text-red-400'}`}>
                        {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                      </span>
                      <DropdownMenu>
                        <DropdownMenuTrigger className="inline-flex h-7 w-7 items-center justify-center rounded-md text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
                          <MoreHorizontal className="w-4 h-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-36">
                          <DropdownMenuItem onClick={() => setEditing(t)}>
                            <Pencil className="w-3.5 h-3.5 mr-2" /> Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600 focus:text-red-600" onClick={() => setDeleting(t)}>
                            <Trash2 className="w-3.5 h-3.5 mr-2" /> Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </li>
                ))}
              </ul>
            </>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!editing} onOpenChange={(open) => !open && setEditing(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>Editar Transação</DialogTitle></DialogHeader>
          {editing && (
            <TransactionForm
              transaction={editing}
              onSuccess={() => { setEditing(null); onRefetch() }}
              onCancel={() => setEditing(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleting} onOpenChange={(open) => !open && setDeleting(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir transação?</AlertDialogTitle>
            <AlertDialogDescription>
              &ldquo;{deleting?.description}&rdquo; será removida permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction className="bg-red-500 hover:bg-red-600" onClick={handleDelete}>
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
