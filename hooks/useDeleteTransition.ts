import { useCallback } from 'react'
import { createClient } from '@/utils/supabase/client'

const supabase = createClient()

type SuccessCallback = () => void
type ErrorCallback = (error: Error) => void

const useDeleteTransition = (
  onSuccess: SuccessCallback,
  onError: ErrorCallback
) => {
  const deleteTransition = useCallback(
    async (clientId: string) => {
      try {
        const { error } = await supabase
          .from('transition')
          .delete()
          .eq('id', clientId)

        if (error) {
          throw new Error(error.message)
        }

        console.log('Deletion successful')
        onSuccess()
      } catch (error: any) {
        console.error('Error in deletion process:', error)
        onError(error)
      }
    },
    [onSuccess, onError]
  )

  return deleteTransition
}

export default useDeleteTransition
