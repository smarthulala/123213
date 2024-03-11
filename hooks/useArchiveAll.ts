import extractErrorMessage from '@/utils/error-utils/errorUtils'
import { createClient } from '@/utils/supabase/client'
import { useCallback, useState } from 'react'

const supabase = createClient()

const useArchiveAll = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchClients = useCallback(async () => {
    setIsLoading(true)
    try {
      const { error: fetchError } = await supabase
        .from('transition')
        .update({ archive: true })
        .eq('archive', false)

      if (fetchError) {
        throw new Error(fetchError.message)
      }

      window.location.reload()
    } catch (fetchError) {
      setError(extractErrorMessage(fetchError))
    } finally {
      setIsLoading(false)
    }
  }, [])

  return { isLoading, error, mutate: fetchClients }
}

export default useArchiveAll
