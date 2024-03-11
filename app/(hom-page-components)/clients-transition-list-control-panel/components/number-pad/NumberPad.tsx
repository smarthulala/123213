import TOP_UP_CONST from '@/data/top-up-const'
import React, { Dispatch, FC, SetStateAction, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import Image from 'next/image'

interface Props {
  setAmount: Dispatch<SetStateAction<string>>
  amount: string
}

const NumberPad: FC<Props> = ({ setAmount, amount }) => {
  const [accumulatedAmount, setAccumulatedAmount] = useState<number | null>(
    null
  )

  return (
    <div className='grid grid-cols-3 gap-0 rounded-3xl px-14 py-4'>
      {TOP_UP_CONST.map(topUp => (
        <div
          key={uuidv4()}
          className='flex items-center justify-center opacity-80'
        >
          <button
            type='button'
            className='m-3 flex w-[200px] items-center justify-center rounded bg-gradient-to-br from-cyan-300 to-blue-600 px-2 py-1 text-4xl font-bold text-white shadow-lg shadow-cyan-300/50 duration-300 ease-in-out hover:scale-105 hover:from-cyan-300 hover:to-blue-500'
            onClick={() => {
              if (topUp.value === 'D') {
                setAmount(prevAmount => prevAmount.slice(0, -1))
                setAccumulatedAmount(null)
              } else if (topUp.value === 'C') {
                setAmount('')
                setAccumulatedAmount(null)
              } else {
                // Handle the logic for '25' becoming '50'
                const newValue =
                  accumulatedAmount !== null
                    ? accumulatedAmount + Number(topUp.value)
                    : Number(topUp.value)

                setAmount(newValue.toString())
                setAccumulatedAmount(newValue)
              }
            }}
          >
            <div

            // className='w-[100px] rounded bg-gradient-to-br from-cyan-300 to-blue-600 py-4 font-bold'
            >
              {topUp.value}
            </div>
          </button>
        </div>
      ))}
    </div>
  )
}

export default NumberPad
