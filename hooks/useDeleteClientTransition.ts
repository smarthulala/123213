import { useCallback } from 'react'
import { createClient } from '@/utils/supabase/client'

const supabase = createClient()

function useDeleteClientTransition() {
  const deleteTransaction = useCallback(async (clientId: string) => {
    const { error } = await supabase
      .from('transition')
      .delete()
      .eq('id', clientId)

    if (error) {
      console.error('Delete error:', error.message)
      return false
    }
    console.log('Transaction deleted successfully')
    return true
  }, [])

  return deleteTransaction
}

export default useDeleteClientTransition
