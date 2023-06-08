import { createContext, ReactNode, useEffect, useState } from 'react'
interface ITransactionsProps {
  id: number
  description: string
  type: 'income' | 'outcome'
  category: string
  price: number
  createdAt: string
}
interface TransactionsContextData {
  transactions: ITransactionsProps[]
  fetchTransactions: (query?: string) => Promise<void>
}
interface TransactionsProviderProps {
  children: ReactNode
}
export const TransactionsContext = createContext({} as TransactionsContextData)
export function TransactionsProvider({ children }: TransactionsProviderProps) {
  const [transactions, setTransactions] = useState<ITransactionsProps[]>([])
  async function fetchTransactions(query?: string) {
    const url = new URL('http://localhost:3000/transactions')
    if (query) {
      url.searchParams.append('q', query)
    }
    const response = await fetch(url)
    const data = await response.json()
    setTransactions(data)
    console.log(data)
  }
  useEffect(() => {
    fetchTransactions()
  }, [])
  return (
    <TransactionsContext.Provider value={{ transactions, fetchTransactions }}>
      {children}
    </TransactionsContext.Provider>
  )
}
