import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/utils/supabase/client'
import extractErrorMessage from '@/utils/error-utils/errorUtils'

const supabase = createClient()

const useClientTransitions = (clientId: string | null) => {
  const [clientsTransitionList, setClientsTransitionList] = useState<
    ClientsTransition[] | null
  >(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTransitions = useCallback(async () => {
    if (!clientId) {
      setClientsTransitionList(null)
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    try {
      const { data, error: fetchError } = await supabase
        .from('transition')
        .select()
        .eq('client_id', clientId)
        .order('created_at', { ascending: false })
        .eq('archive', false)

      if (fetchError) {
        throw new Error(fetchError.message)
      }

      setClientsTransitionList(data)
    } catch (fetchError) {
      setError(extractErrorMessage(fetchError))
    } finally {
      setIsLoading(false)
    }
  }, [clientId])

  useEffect(() => {
    fetchTransitions()
  }, [clientId])

  return {
    clientsTransitionList,
    isLoading,
    error,
    mutate: fetchTransitions
  }
}

export default useClientTransitions
