import React from 'react'
import Image from 'next/image'

export default function Loading() {
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
