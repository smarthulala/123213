import Loading from '@/app/loading'
import { Card } from '@/components/ui/card'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'
import { Separator } from '@/components/ui/separator'
import useAllBalance from '@/hooks/useAllBalance'
import { format } from 'date-fns'
import Image from 'next/image'
import ClientTransactionSummary from './client-transaction-summary'

const AllBalanceForClient = () => {
  const { loading, error, groupedTransactions } = useAllBalance()
  if (loading) {
    return <Loading />
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  return (
    <>
      {Object.entries(groupedTransactions).map(
        ([name, transactions]) =>
          // Exclude transactions for specific names
          !['Expense', 'Insurance', 'Commission'].includes(name) && (
            <Card key={name} className='border-0'>
              <div className='flex gap-4'>
                <h2>{name}</h2>
                {transactions.length > 0 && (
                  <ClientTransactionSummary
                    clientId={transactions[0].client_id}
                  />
                )}
              </div>

              <ul className='flex flex-wrap gap-1'>
                {transactions.map(
                  transaction =>
                    (transaction.transition_type === 'TopUp' ||
                      transaction.transition_type === 'CashOut') && (
                      <Popover key={transaction.id}>
                        <PopoverTrigger>
                          <Card className='border-0'>
                            <li
                              className={`flex aspect-square h-[74px] flex-col rounded-xl border border-violet-300 p-1 text-[18px] leading-[1.2] ${
                                transaction.transition_type === 'CashOut'
                                  ? 'text-red-300'
                                  : 'text-white-300'
                              }`}
                            >
                              <span>
                                {format(
                                  new Date(transaction.created_at),
                                  'HH:mm'
                                )}
                              </span>
                              <span className='m-auto text-[16px]'>
                                {transaction.transition_type}
                              </span>
                              <span className='font-bold'>
                                {transaction.amount}
                              </span>
                            </li>
                          </Card>
                        </PopoverTrigger>
                        <PopoverContent className='ml-4 rounded-xl border-violet-300'>
                          <Image
                            src={transaction.signature}
                            alt='Signature'
                            layout='fixed'
                            width={100}
                            height={100}
                          />
                        </PopoverContent>
                      </Popover>
                    )
                )}
              </ul>
              <Separator className='mt-2' />
            </Card>
          )
      )}
    </>
  )
}

export default AllBalanceForClient
