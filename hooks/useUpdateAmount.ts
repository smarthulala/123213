import { useCallback } from 'react'
import { createClient } from '@/utils/supabase/client'

const supabase = createClient()

function useUpdateAmount() {
  const updateAmount = useCallback(
    async (clientId: string, newAmount: string) => {
      const { data, error } = await supabase
        .from('transition')
        .update({ amount: newAmount })
        .eq('id', clientId)
        .select()

      if (error) {
        console.error('Update error:', error.message)
        return false
      }
      console.log('Updated data:', data)
      
      return true
    },
    []
  )

  return updateAmount
}

export default useUpdateAmount
