import Loading from '@/app/loading'
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
import { Card } from '@/components/ui/card'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import useAllBalance from '@/hooks/useAllBalance'
import useDeleteClientTransition from '@/hooks/useDeleteClientTransition'
import useUpdateAmount from '@/hooks/useUpdateAmount'
import useUpdateType from '@/hooks/useUpdateType'
import { format } from 'date-fns'
import { useState } from 'react'

const AllBalanceForAdmin = () => {
  const { mutate, loading, error, groupedTransactions } = useAllBalance()
  const [amount, setAmount] = useState('')
  const [type, setType] = useState<TransitionType>(null)
  const updateAmount = useUpdateAmount()
  const updateType = useUpdateType()
  const deleteClientTransition = useDeleteClientTransition()

  const handleDelete = async (clientId: string) => {
    const success = await deleteClientTransition(clientId)
    if (success) {
      mutate()
      console.log('Transaction deleted successfully.')
      window.location.reload()
    } else {
      console.error('Failed to delete transaction.')
    }
  }

  const handleUpdateAmount = async (clientId: string) => {
    const success = await updateAmount(clientId, amount)
    if (success) {
      mutate()
      console.log('Amount updated successfully.')
      window.location.reload()
    } else {
      console.error('Failed to update amount.')
    }
  }

  const handleUpdateType = async (clientId: string) => {
    const success = await updateType(clientId, type)
    if (success) {
      mutate()
      console.log('Type updated successfully.')
      window.location.reload()
    } else {
      console.error('Failed to update Type.')
    }
  }

  if (loading) {
    return <Loading />
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  return (
    <>
      {Object.entries(groupedTransactions).map(([name, transactions]) => (
        <Card key={name} className='border-0'>
          <h2 className=''>{name}</h2>
          <ul className='flex flex-wrap gap-1'>
            {transactions.map(
              transaction =>
                (transaction.transition_type === 'TopUp' ||
                  transaction.transition_type === 'CashOut' ||
                  transaction.transition_type === 'Tip' ||
                  transaction.transition_type === 'Expense' ||
                  transaction.transition_type === 'Insurance' ||
                  transaction.transition_type === 'Commission') && (
                  <Popover key={transaction.id}>
                    <PopoverTrigger>
                      <Card className='border-0'>
                        <li
                          className={`flex aspect-square h-[74px] flex-col rounded-xl border border-violet-300 p-1 text-[18px] leading-[1.2] ${(() => {
                            switch (transaction.transition_type) {
                              case 'CashOut':
                                return 'text-red-300'
                              default:
                                return 'text-white-300'
                            }
                          })()}`}
                        >
                          <span>
                            {format(new Date(transaction.created_at), 'HH:mm')}
                          </span>
                          <span className='m-auto text-[16px]'>
                            {(() => {
                              switch (transaction.transition_type) {
                                case 'Commission':
                                  return 'Comm'
                                case 'Insurance':
                                  return 'Ins'
                                default:
                                  return transaction.transition_type
                              }
                            })()}
                          </span>
                          <span className='font-bold'>
                            {' '}
                            {transaction.amount}
                          </span>
                        </li>
                      </Card>
                    </PopoverTrigger>
                    <PopoverContent className='ml-4 flex flex-col gap-4 rounded-xl border-violet-300'>
                      <div className='flex gap-2'>
                        <input
                          type='text'
                          value={amount}
                          onChange={e => setAmount(e.target.value)}
                          className='rounded-3xl px-4 text-black'
                        />
                        <button
                          type='button'
                          onClick={() => handleUpdateAmount(transaction.id)}
                          className='text-xs'
                        >
                          Update Amount
                        </button>
                      </div>
                      <div className='flex gap-2'>
                        <Select
                          onValueChange={value =>
                            setType(value as TransitionType)
                          }
                        >
                          <SelectTrigger className='w-[180px] rounded-3xl'>
                            <SelectValue placeholder='Change Type To' />
                          </SelectTrigger>
                          <SelectContent className='rounded-3xl'>
                            <SelectGroup>
                              <SelectItem value='TopUp'>Top up</SelectItem>
                              <SelectItem value='Tip'>Tip</SelectItem>
                              <SelectItem value='Expense'>Expense</SelectItem>
                              <SelectItem value='Commission'>
                                Commission
                              </SelectItem>
                              <SelectItem value='Insurance'>
                                Insurance
                              </SelectItem>
                              <SelectItem value='CashOut'>Cash out</SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                        <button
                          type='button'
                          onClick={() => handleUpdateType(transaction.id)}
                          className='text-xs'
                        >
                          Update Type
                        </button>
                      </div>

                      <AlertDialog>
                        <AlertDialogTrigger className='cursor-pointer rounded-3xl bg-red-700 px-1'>
                          Delete
                        </AlertDialogTrigger>

                        <AlertDialogContent className='rounded-3xl'>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Are you absolutely sure?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will
                              permanently remove this record from your database
                              servers.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className='rounded-3xl'>
                              Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction className='cursor-pointer  rounded-3xl bg-red-700'>
                              <button
                                type='button'
                                className=' '
                                onClick={() => handleDelete(transaction.id)}
                              >
                                Delete this record
                              </button>
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </PopoverContent>
                  </Popover>
                )
            )}
          </ul>
          <Separator className='mt-2' />
        </Card>
      ))}
    </>
  )
}

export default AllBalanceForAdmin
