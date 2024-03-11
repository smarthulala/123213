import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'

const supabase = createClient()

const useCheckArchive = () => {
  const [hasOldUnarchived, setHasOldUnarchived] = useState(false)

  useEffect(() => {
    const checkOldUnarchivedRecords = async () => {
      const twelveHoursAgo = new Date(
        new Date().getTime() - 20 * 60 * 60 * 1000
      )

      const { data, error } = await supabase
        .from('transition')
        .select('*')
        .gte('created_at', twelveHoursAgo.toISOString())
        .eq('archive', false)

      if (error) {
        console.error('Error fetching records:', error)
        return
      }

      setHasOldUnarchived(data.length > 0)
    }

    checkOldUnarchivedRecords()
  }, [])

  return hasOldUnarchived
}

export default useCheckArchive
