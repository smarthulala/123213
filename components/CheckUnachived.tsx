import React from 'react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

const CheckUnachived = ({
  hasOldUnarchived
}: {
  hasOldUnarchived: boolean
}) => {
  return (
    <>
      {hasOldUnarchived && (
        <Alert
          variant='destructive'
          className='col-span-2 border-4 sm:col-span-3 '
        >
          <AlertTitle className='sm:text-2xl'>Urgent:</AlertTitle>
          <AlertDescription className='sm:text-lg'>
            Records older than 20 hours remain unarchived. Please contact the
            admin immediately to ensure they are archived as soon as possible.
          </AlertDescription>
        </Alert>
      )}
    </>
  )
}
export default CheckUnachived
