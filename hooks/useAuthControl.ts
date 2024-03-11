import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'

const supabase = createClient()

const useAuthControl = () => {
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false) // 默认假设用户已登录

  useEffect(() => {
    const fetchData = async () => {
      const {
        data: { user },
        error
      } = await supabase.auth.getUser()

      if (error) {
        console.error('Error fetching user:', error.message)
        setIsUserLoggedIn(false) 
        return
      }

      setIsUserLoggedIn(!!user) 
    }

    fetchData()
  }, [])
}

export default useAuthControl
