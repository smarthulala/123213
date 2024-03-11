import extractErrorMessage from '@/utils/error-utils/errorUtils'
import { createClient } from '@/utils/supabase/client'
import { useCallback, useEffect, useState } from 'react'

type ClientsTransition = {
  transition_type: string
  amount: string
  name: string
  created_at: string
  archive: boolean
}

const supabase = createClient()

const useComm = () => {
  const [comm, setComm] = useState<ClientsTransition[] | null>(null)
  const [comSum, setSum] = useState(0)
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

      setComm(data)

      const expenseTotal =
        data
          .filter(
            (item: ClientsTransition) =>
              !item.archive && item.transition_type === 'Commission'
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

  return { comm, comSum, isLoading, error, mutate: fetchExpenses }
}

export default useComm
