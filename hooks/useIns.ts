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

const useIns = () => {
  const [ins, setIns] = useState<ClientsTransition[] | null>(null)
  const [insSum, setInsSum] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchIns = useCallback(async () => {
    setIsLoading(true)
    try {
      const { data, error: fetchError } = await supabase
        .from('transition')
        .select('transition_type, amount, name, created_at, archive')
        .eq('archive', false)
      if (fetchError) {
        throw new Error(fetchError.message)
      }

      setIns(data)

      const insTotal =
        data
          .filter(
            (item: ClientsTransition) =>
              !item.archive && item.transition_type === 'Insurance'
          )
          .reduce((acc, curr) => acc + parseFloat(curr.amount), 0) || 0

          setInsSum(insTotal)
    } catch (fetchError) {
      setError(extractErrorMessage(fetchError))
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchIns()
  }, [fetchIns])

  return { ins, insSum, isLoading, error, mutate: fetchIns }
}

export default useIns
