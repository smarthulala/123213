'use client'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog'
import { Input } from '@/components/ui/input'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { TYPE_MAP } from '@/data/top-up-const'
import { createClient } from '@/utils/supabase/client'
import Image from 'next/image'
import { FC, FormEvent, useEffect, useRef, useState } from 'react'
import SignatureCanvas from 'react-signature-canvas'
import { v4 as uuidv4 } from 'uuid'
import NumberPad from './components/number-pad'
import SignaturePanel from './components/signature-panel'

const supabase = createClient()

interface Props {
  selectedClientName?: string | null
  selectedClientId?: string | null
  onClientsTransitionUpdated: () => void
  onClientsUpdated: () => void
  setSelectedClientName: (name: string | null) => void
  setSelectedClientId: (id: string | null) => void
}

const ClientsTransitionListControlPanel: FC<Props> = ({
  selectedClientName = null,
  selectedClientId = null,
  onClientsTransitionUpdated,
  onClientsUpdated,
  setSelectedClientName,
  setSelectedClientId
}) => {
  const [transitionType, setTransitionType] = useState<string>('')
  const [amount, setAmount] = useState<string>('')
  const sigPad = useRef<SignatureCanvas>(null)
  const resetForm = () => {
    setAmount('')
    setTransitionType('')
    sigPad.current?.clear()
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!amount || Number.isNaN(Number(amount))) {
      alert('Please enter a valid amount.')
      return
    }

    if (!transitionType) {
      alert('Please select a transition type.')
      return
    }

    if (sigPad.current?.isEmpty()) {
      alert('Please provide a signature.')
      return
    }
    try {
      const signature = sigPad.current
        ?.getTrimmedCanvas()
        .toDataURL('image/png')

      const transitionData = {
        name: selectedClientName,
        transition_type: transitionType,
        amount,
        client_id: selectedClientId,
        signature
      }

      const { error } = await supabase
        .from('transition')
        .insert([transitionData])

      if (error) {
        throw new Error(error.message)
      }

      onClientsUpdated()
      onClientsTransitionUpdated()

      if (transitionType === 'Tip') {
        const { data: employeeData, error: employeeError } = await supabase
          .from('employee')
          .select('tip')
          .eq('name', selectedClientName)
          .single()

        if (employeeError) {
          throw new Error(employeeError.message)
        }

        const currentTip = Number(employeeData.tip) || 0
        const accumulatedTip = currentTip + Number(amount)

        const { data: updatedData, error: updateError } = await supabase
          .from('employee')
          .update({ tip: accumulatedTip })
          .eq('name', selectedClientName)

        if (updateError) {
          throw new Error(updateError.message)
        }

        console.log('Employee tip accumulated:', updatedData)
      }

      resetForm()
      setSelectedClientName('')
      setSelectedClientId('')
      localStorage.removeItem('amount')
      localStorage.removeItem('transitionType')
    } catch (error) {
      console.error('Error in insertion process:', error)
    }
  }

  const clearSignature = () => {
    sigPad.current?.clear()
  }

  useEffect(() => {
    const resizeSignaturePad = () => {
      if (sigPad.current) {
        const canvas = sigPad.current.getCanvas()
        const ratio = Math.max(window.devicePixelRatio || 1, 1)
        const container = canvas.getBoundingClientRect()
        canvas.width = container.width * ratio
        canvas.height = container.height * ratio
        const context = canvas.getContext('2d')
        if (context) {
          context.scale(ratio, ratio)
        }
        sigPad.current.clear()
      }
    }

    resizeSignaturePad()

    window.addEventListener('resize', resizeSignaturePad)

    return () => {
      window.removeEventListener('resize', resizeSignaturePad)
    }
  }, [])

  useEffect(() => {
    const savedAmount = localStorage.getItem('amount')
    const savedTransitionType = localStorage.getItem('transitionType')

    if (savedAmount) {
      setAmount(savedAmount)
    }
    if (savedTransitionType) {
      setTransitionType(savedTransitionType)

      if (savedTransitionType === 'expense') {
        setSelectedClientName('expense')
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('amount', amount)
    localStorage.setItem('transitionType', transitionType)
  }, [amount, transitionType])

  return (
    <div>
      <form>
        <div className='mt-10 grid grid-cols-2'>
          <div className='flex justify-center'>
            <ToggleGroup
              type='single'
              value={transitionType}
              defaultValue='TopUp'
              onValueChange={value => {
                setTransitionType(value)
                if (value === 'Expense') {
                  setSelectedClientName('Expense')
                  setSelectedClientId('18dc3afb-0ce4-4c9f-896c-985fa6a76277')
                } else if (value === 'Insurance') {
                  setSelectedClientName('Insurance')
                  setSelectedClientId('26edfdf9-f72b-455a-9719-7194108b7445')
                } else if (value === 'Commission') {
                  setSelectedClientName('Commission')
                  setSelectedClientId('56129cdc-ca99-4a95-98a2-a00806998a08')
                }
              }}
              className='grid grid-cols-2 gap-2'
            >
              {TYPE_MAP.map(type => (
                <ToggleGroupItem
                  key={uuidv4()}
                  value={type.value}
                  className='h-[90px] flex-col justify-center text-nowrap rounded-3xl px-1 text-sm'
                >
                  <Image
                    src={type.src}
                    alt={type.label}
                    width={40}
                    height={40}
                  />
                  <div
                    className={`transition-all duration-1000 ${
                      transitionType === type.value ? 'opacity-1' : 'opacity-20'
                    }`}
                  >
                    {type.label}
                  </div>
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>
          <div>
            <Input
              type='text'
              value={amount}
              onChange={e => setAmount(e.target.value)}
              placeholder='0'
              className='h-24 rounded-3xl text-center text-7xl font-bold'
            />
            <NumberPad setAmount={setAmount} amount={amount} />
            <div className='flex items-center justify-center'>
              <AlertDialog>
                <AlertDialogTrigger className='h-16 w-1/3 rounded bg-gradient-to-br from-cyan-300 to-blue-600 px-2 py-1 text-2xl font-bold text-white shadow-lg shadow-cyan-300/50 duration-300 ease-in-out hover:scale-105 hover:from-cyan-300 hover:to-blue-500'>
                  Confirm
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle className='text-3xl'>
                      Confirm Details:
                    </AlertDialogTitle>
                    <AlertDialogDescription className='text text-center text-5xl font-bold'>
                      <div className='capitalize'>
                        Name: {selectedClientName}
                      </div>
                      <div>
                        {transitionType}: ${amount}
                      </div>
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      className='w-[150px] rounded bg-gradient-to-br from-cyan-300 to-blue-600 px-2 py-1 text-2xl font-bold text-white shadow-lg shadow-cyan-300/50 duration-300 ease-in-out hover:scale-105 hover:from-cyan-300 hover:to-blue-500'
                      onClick={handleSubmit}
                    >
                      Confirm
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>

          <div className='col-span-2 mt-4'>
            <SignaturePanel sigPad={sigPad} onClearSignature={clearSignature} />
          </div>
        </div>
      </form>
    </div>
  )
}

export default ClientsTransitionListControlPanel
