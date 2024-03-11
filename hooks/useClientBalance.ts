import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/utils/supabase/client'
import extractErrorMessage from '@/utils/error-utils/errorUtils'

const useClientBalance = (clientId: string) => {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [topUpSum, setTopUpSum] = useState(0)
  const [cashOutSum, setCashOutSum] = useState(0)

  const fetchTransactionsSum = useCallback(async () => {
    setIsLoading(true)
    const supabase = createClient()
    try {
      const { data: transactions, error: fetchError } = await supabase
        .from('transition')
        .select('transition_type, amount')
        .eq('client_id', clientId)
        .eq('archive', false)

      if (fetchError) {
        throw new Error(fetchError.message)
      }

      const topUpTotal =
        transactions
          .filter(transaction => transaction.transition_type === 'TopUp')
          .reduce((acc, curr) => acc + parseFloat(curr.amount), 0) || 0

      const cashOutTotal =
        transactions
          .filter(transaction => transaction.transition_type === 'CashOut')
          .reduce((acc, curr) => acc + parseFloat(curr.amount), 0) || 0

      setTopUpSum(topUpTotal)
      setCashOutSum(cashOutTotal)
    } catch (fetchError) {
      setError(extractErrorMessage(fetchError))
    } finally {
      setIsLoading(false)
    }
  }, [clientId])

  useEffect(() => {
    fetchTransactionsSum()
  }, [fetchTransactionsSum])

  return {
    isLoading,
    error,
    topUpSum,
    cashOutSum
  }
}

export default useClientBalance
