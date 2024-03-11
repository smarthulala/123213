import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'

const supabase = createClient()

const useAccessControl = (allowedEmail: string) => {
  const [isAllowed, setIsAllowed] = useState(false)

  useEffect(() => {
    const checkAccess = async () => {
      const {
        data: { session }
      } = await supabase.auth.getSession()
      const user = session?.user

      setIsAllowed(!!user && user.email === allowedEmail)
    }

    checkAccess()
  }, [allowedEmail])

  return isAllowed
}

export default useAccessControl
