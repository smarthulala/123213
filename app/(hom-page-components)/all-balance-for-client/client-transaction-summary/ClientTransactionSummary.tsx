import React from 'react'
import useClientBalance from '@/hooks/useClientBalance'

const ClientTransactionSummary = ({ clientId }: { clientId: string }) => {
  const { isLoading, error, topUpSum, cashOutSum } = useClientBalance(clientId)

  if (isLoading) {
    return <div>Loading...</div>
  }
  if (error) {
    return <div>Error: {error}</div>
  }

  return (
    <div className='flex gap-4'>
      <p>
        Top Up: <span className='font-bold'>{topUpSum}</span>
      </p>
      <p>
        Cash Out: <span className='font-bold'>{cashOutSum}</span>
      </p>
      <p>
        Balance: <span className='font-bold'>{cashOutSum - topUpSum}</span>
      </p>
    </div>
  )
}

export default ClientTransactionSummary
