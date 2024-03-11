import React from 'react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

const Alerts = ({ error }: { error: string | null }) => {
  if (!error) {
    return null
  }

  return (
    <Alert>
      <AlertTitle>Error!</AlertTitle>
      <AlertDescription>{error}</AlertDescription>
    </Alert>
  )
}

export default Alerts
