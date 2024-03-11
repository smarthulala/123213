import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/utils/supabase/client'
import extractErrorMessage from '@/utils/error-utils/errorUtils'

type ClientsTransition = {
  transition_type: string
  amount: string
  name: string
  created_at: string
  archive: boolean
}

const supabase = createClient()

const useExpense = () => {
  const [expenses, setExpenses] = useState<ClientsTransition[] | null>(null)
  const [sum, setSum] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchExpenses = useCallback(async () => {
    setIsLoading(true)
    try {
      const { data, error: fetchError } = await supabase
        .from('transition')
        .select('transition_type, amount, name, created_at, archive')
        .eq('archive', false)
      if (fetchError) {
        throw new Error(fetchError.message)
      }

      setExpenses(data)

      const expenseTotal =
        data
          .filter(
            (item: ClientsTransition) =>
              !item.archive && item.transition_type === 'Expense'
          )
          .reduce((acc, curr) => acc + parseFloat(curr.amount), 0) || 0

      setSum(expenseTotal)
    } catch (fetchError) {
      setError(extractErrorMessage(fetchError))
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchExpenses()
  }, [fetchExpenses])

  return { expenses, sum, isLoading, error, mutate: fetchExpenses }
}

export default useExpense
