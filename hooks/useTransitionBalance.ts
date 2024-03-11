import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import extractErrorMessage from '@/utils/error-utils/errorUtils'

const useTransitionBalance = () => {
  const [balance, setBalance] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true)
      const supabase = createClient()
      try {
        const { data: transactions, error: fetchError } = await supabase
          .from('transition')
          .select('amount, transition_type')
          .in('transition_type', [
            'CashOut',
            'TopUp',
            'Tip',
            'Expense',
            'Commission',
            'Insurance'
          ])
          .eq('archive', false)
        if (fetchError) {
          throw new Error(fetchError.message)
        }

        const totalTopUp = transactions
          .filter(transaction => transaction.transition_type === 'TopUp')
          .reduce((acc, curr) => acc + parseFloat(curr.amount), 0)

        const cashOutTypes = [
          'CashOut',
          'Tip',
          'Expense',
          'Commission',
          'Insurance'
        ]

        const totalCashOut = transactions
        .filter(transaction => cashOutTypes.includes(transaction.transition_type))
        .reduce((acc, curr) => acc + parseFloat(curr.amount), 0)

        setBalance(totalTopUp - totalCashOut)
      } catch (fetchError) {
        setError(extractErrorMessage(fetchError))
      } finally {
        setLoading(false)
      }
    }

    fetchTransactions()
  }, [])

  return { balance, loading, error }
}

export default useTransitionBalance
