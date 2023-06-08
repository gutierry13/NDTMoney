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
}
interface TransactionsProviderProps {
  children: ReactNode
}
export const TransactionsContext = createContext({} as TransactionsContextData)
export function TransactionsProvider({ children }: TransactionsProviderProps) {
  const [transactions, setTransactions] = useState<ITransactionsProps[]>([])
  async function loadTransactionsData() {
    const response = await fetch('http://localhost:3000/transactions')
    const data = await response.json()
    setTransactions(data)
    console.log(data)
  }
  useEffect(() => {
    loadTransactionsData()
  }, [])
  return (
    <TransactionsContext.Provider value={{ transactions }}>
      {children}
    </TransactionsContext.Provider>
  )
}
