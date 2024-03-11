import useTransitionBalance from '@/hooks/useTransitionBalance'
import React from 'react'
import Image from 'next/image'

const TransitionAllBalance = () => {
  const { balance, loading, error } = useTransitionBalance()

  if (loading) {
    return (
      <div className='flex h-screen w-full items-center justify-center'>
        <Image
          alt='loading'
          src='/icons8-loading.svg'
          width={100}
          height={100}
          className='motion-safe:animate-spin '
        />
      </div>
    )
  }
  if (error) {
    return <div>Error: {error}</div>
  }
  const formattedBalance = balance.toLocaleString('en-US', {
    style: 'currency',
    currency: 'AUD'
  })
  return <div className='text-wrap'>{formattedBalance}</div>
}

export default TransitionAllBalance
