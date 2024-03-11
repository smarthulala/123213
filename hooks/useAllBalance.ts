import { useCallback, useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import extractErrorMessage from '@/utils/error-utils/errorUtils'

const useAllBalance = () => {
  const [balance, setBalance] = useState(0)
  const [totalTopUp, setTotalTopUp] = useState(0)
  const [totalCashOut, setTotalCashOut] = useState(0)
  const [commission, setCommission] = useState(0)
  const [insurance, setInsurance] = useState(0)
  const [tip, setTotalTip] = useState(0)
  const [expense, setTotalExpense] = useState(0)
  const [groupedTransactions, setGroupedTransactions] = useState<{
    [key: string]: ClientsTransition[]
  }>({})

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTransactions = useCallback(async () => {
    setLoading(true)
    const supabase = createClient()
    try {
      const { data: transactions, error: fetchError } = await supabase
        .from('transition')
        .select('*')
        .eq('archive', false)
      if (fetchError) {
        throw new Error(fetchError.message)
      }

      
      const sortedTransactions = transactions.sort(
        (b, a) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )

      const transactionsByName = sortedTransactions.reduce(
        (acc, transaction) => {
          if (!acc[transaction.name]) {
            acc[transaction.name] = []
          }
          acc[transaction.name].push(transaction)
          return acc
        },
        {} as { [key: string]: ClientsTransition[] }
      )

      const totalTransactionsTopUp = transactions
        .filter(transaction => transaction.transition_type === 'TopUp')
        .reduce((acc, curr) => acc + parseFloat(curr.amount), 0)

      const totalTransactionsCashOut = transactions
        .filter(transaction => transaction.transition_type === 'CashOut')
        .reduce((acc, curr) => acc + parseFloat(curr.amount), 0)

      const totalTransactionsCommission = transactions
        .filter(transaction => transaction.transition_type === 'Commission')
        .reduce((acc, curr) => acc + parseFloat(curr.amount), 0)

      const totalTransactionsInsurance = transactions
        .filter(transaction => transaction.transition_type === 'Insurance')
        .reduce((acc, curr) => acc + parseFloat(curr.amount), 0)

      const totalTransactionsTip = transactions
        .filter(transaction => transaction.transition_type === 'Tip')
        .reduce((acc, curr) => acc + parseFloat(curr.amount), 0)

      const totalTransactionsExpense = transactions
        .filter(transaction => transaction.transition_type === 'Expense')
        .reduce((acc, curr) => acc + parseFloat(curr.amount), 0)

      const balanceTypes = ['CashOut', 'Tip', 'Commission', 'Insurance']

      const totalTransactionsBalance = transactions
        .filter(transaction =>
          balanceTypes.includes(transaction.transition_type)
        )
        .reduce((acc, curr) => acc + parseFloat(curr.amount), 0)

      setBalance(totalTransactionsTopUp - totalTransactionsBalance)
      setTotalTopUp(totalTransactionsTopUp)
      setTotalCashOut(totalTransactionsCashOut)
      setCommission(totalTransactionsCommission)
      setInsurance(totalTransactionsInsurance)
      setTotalTip(totalTransactionsTip)
      setTotalExpense(totalTransactionsExpense)
      setGroupedTransactions(transactionsByName)
    } catch (fetchError) {
      setError(extractErrorMessage(fetchError))
    } finally {
      setLoading(false)
    }
  }, [])
  useEffect(() => {
    fetchTransactions()
  }, [fetchTransactions])

  return {
    commission,
    insurance,
    tip,
    expense,
    totalTopUp,
    totalCashOut,
    balance,
    groupedTransactions,
    loading,
    error,
    mutate: fetchTransactions,
  }
}

export default useAllBalance
