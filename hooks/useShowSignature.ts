import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/utils/supabase/client'
import extractErrorMessage from '@/utils/error-utils/errorUtils'

const supabase = createClient()

const useShowSignature = (transitionId: string | null) => {
  const [signature, setSignature] = useState<string | null>(null)

  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchSignature = useCallback(async () => {
    if (!transitionId) {
      setSignature(null)
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    try {
      const { data, error: fetchError } = await supabase
        .from('transition')
        .select('signature')
        .eq('id', transitionId)
        .single()

      if (fetchError) {
        throw new Error(fetchError.message)
      }

      setSignature(data.signature || null)
    } catch (fetchError) {
      setError(extractErrorMessage(fetchError))
    } finally {
      setIsLoading(false)
    }
  }, [transitionId])

  useEffect(() => {
    fetchSignature()
  }, [fetchSignature])

  return {
    signature,
    isLoading,
    error
  }
}

export default useShowSignature
