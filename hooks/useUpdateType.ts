import { useCallback } from 'react'
import { createClient } from '@/utils/supabase/client'

const supabase = createClient()

function useUpdateType() {
  const updateType = useCallback(
    async (clientId: string, newType: TransitionType) => {
      const { data, error } = await supabase
        .from('transition')
        .update({ transition_type: newType })
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

  return updateType
}

export default useUpdateType
