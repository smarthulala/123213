import extractErrorMessage from '@/utils/error-utils/errorUtils'
import { createClient } from '@/utils/supabase/client'
import { useEffect, useState } from 'react'

const supabase = createClient()

const useRecentClients = () => {
  const [recentClients, setRecentClients] = useState<Clients[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchRecentTransactionsAndClients = async () => {
    setIsLoading(true)
    try {
      const timeAgo = new Date(
        new Date().getTime() - 24 * 10 * 60000
      ).toISOString()
      const { data: transactions, error: transactionsFetchError } =
        await supabase
          .from('transition')
          .select('client_id, created_at')
          .gte('created_at', timeAgo)

      if (transactionsFetchError) {
        throw new Error(transactionsFetchError.message)
      }

      const uniqueClientIds = Array.from(
        new Set(transactions.map(t => t.client_id))
      )

      const { data: clients, error: clientsFetchError } = await supabase
        .from('client')
        .select('id, name, created_at')
        .in('id', uniqueClientIds)

      if (clientsFetchError) {
        throw new Error(clientsFetchError.message)
      }

      setRecentClients(clients)
    } catch (fetchError) {
      setError(extractErrorMessage(fetchError))
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchRecentTransactionsAndClients()
  }, [])

  return {
    recentClients,
    isLoading,
    error,
    mutate: fetchRecentTransactionsAndClients
  }
}

export default useRecentClients
