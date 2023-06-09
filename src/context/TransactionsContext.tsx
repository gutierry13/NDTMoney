import { ReactNode, useEffect, useState, useCallback } from 'react'
import { api } from '../lib/axios'
import { createContext } from 'use-context-selector'
interface ITransactionsProps {
  id: number
  description: string
  type: 'income' | 'outcome'
  category: string
  price: number
  createdAt: string
}

interface TransactionsProviderProps {
  children: ReactNode
}
interface CreateNewTransactionProps {
  type: 'income' | 'outcome'
  category: string
  description: string
  price: number
}
interface TransactionsContextData {
  transactions: ITransactionsProps[]
  fetchTransactions: (query?: string) => Promise<void>
  createNewTransaction: (data: CreateNewTransactionProps) => Promise<void>
}
export const TransactionsContext = createContext({} as TransactionsContextData)
export function TransactionsProvider({ children }: TransactionsProviderProps) {
  const [transactions, setTransactions] = useState<ITransactionsProps[]>([])
  const fetchTransactions = useCallback(async (query?: string) => {
    const response = await api.get('/transactions', {
      params: {
        _sort: 'createdAt',
        _order: 'desc',
        q: query,
      },
    })
    setTransactions(response.data)
  }, [])
  useEffect(() => {
    fetchTransactions()
  }, [fetchTransactions])
  const createNewTransaction = useCallback(
    async (data: CreateNewTransactionProps) => {
      const { type, category, description, price } = data
      const response = await api.post('/transactions', {
        description,
        price,
        category,
        type,
        createdAt: new Date(),
      })
      setTransactions((state) => [response.data, ...state])
    },
    [],
  )
  return (
    <TransactionsContext.Provider
      value={{ transactions, fetchTransactions, createNewTransaction }}
    >
      {children}
    </TransactionsContext.Provider>
  )
}
