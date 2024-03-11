// useSignOut.js
import { useCallback } from 'react'
import { createClient } from '@/utils/supabase/client'

const supabase = createClient()

const useSignOut = () => {
  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut()
    if (!error) {
      // Redirect to home page after successful sign out
      window.location.href = '/'
    } else {
      console.error('Error signing out:', error.message)
    }
  }, [])

  return signOut
}

export default useSignOut
