import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { format } from 'date-fns'
import { FC } from 'react'
import TransitionAllBalance from '../transition-all-balance/TransitionAllBalance'

interface Props {
  clientsTransitionList: ClientsTransition[] | null
  selectedClientName: string | null
}

const ClientsTransitionList: FC<Props> = ({
  clientsTransitionList,
  selectedClientName
}) => {
  const balance =
    clientsTransitionList?.reduce((acc, client) => {
      const amount = parseFloat(client.amount)

      if (client.transition_type === 'TopUp') {
        return acc + amount
      }
      if (client.transition_type === 'CashOut') {
        return acc - amount
      }
      return acc
    }, 0) || 0

  const formattedBalance = balance.toLocaleString('en-US', {
    style: 'currency',
    currency: 'AUD'
  })

  return (
    <>
      <ScrollArea className='h-[50vh] w-full rounded-3xl border border-violet-300'>
        <Table className='text-xs'>
          <TableCaption>
            A list of your client&apos;s recent transition
          </TableCaption>
          <TableHeader className='border-b-4 border-b-violet-300'>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className='p-0'>
            {clientsTransitionList?.map(clients => (
              <TableRow key={clients.id} className='border-violet-300 p-0'>
                <TableCell className='font-medium '>{clients.name}</TableCell>
                <TableCell className='text-nowrap p-0'>
                  <div className=''>
                    <div>
                      {format(new Date(clients.created_at), 'MM-dd-yy ')}
                    </div>
                    <div>{format(new Date(clients.created_at), ' HH:mm')}</div>
                  </div>{' '}
                </TableCell>
                <TableCell>{clients.transition_type}</TableCell>
                <TableCell>{clients.amount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={5}>Individual Balance</TableCell>
            </TableRow>

            <TableRow>
              <TableCell colSpan={5} className='bg-violet-600 opacity-70'>
                {selectedClientName} {formattedBalance}
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell colSpan={5}>All Balance</TableCell>
            </TableRow>

            <TableRow>
              <TableCell colSpan={5} className='bg-violet-600 opacity-70'>
                <TransitionAllBalance />
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </ScrollArea>
    </>
  )
}

export default ClientsTransitionList
