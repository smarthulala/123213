import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/utils/supabase/client'
import extractErrorMessage from '@/utils/error-utils/errorUtils'

const supabase = createClient()

const useClients = () => {
  const [clients, setClients] = useState<Clients[] | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchClients = useCallback(async () => {
    setIsLoading(true)
    try {
      const { data, error: fetchError } = await supabase.from('client').select()

      if (fetchError) {
        throw new Error(fetchError.message)
      }

      setClients(data)
    } catch (fetchError) {
      setError(extractErrorMessage(fetchError))
    } finally {
      setIsLoading(false)
    }
  }, [])
  useEffect(() => {
    fetchClients()
  }, [])

  return { clients, isLoading, error, mutate: fetchClients }
}

export default useClients
