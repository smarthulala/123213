import TransitionAllBalance from '@/app/(hom-page-components)/transition-all-balance/TransitionAllBalance'
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
import useDeleteTransition from '@/hooks/useDeleteTransition'
import useUpdateAmount from '@/hooks/useUpdateAmount'
import { FC, useState } from 'react'
import TransitionRow from './components/transition-row'

interface Props {
  clientsTransitionList: ClientsTransition[] | null
  onClientsUpdated: () => void
  selectedClientName: string | null
}

const ClientsTransitionList: FC<Props> = ({
  clientsTransitionList,
  onClientsUpdated,
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
  
  const updateAmount = useUpdateAmount()

  const [editingClientId, setEditingClientId] = useState<string | null>(null)
  const [editingAmount, setEditingAmount] = useState<string>('')

  const handleUpdateAmount = async (clientId: string) => {
    if (!editingAmount) {
      return
    }

    const success = await updateAmount(clientId, editingAmount)
    if (success) {
      console.log('Amount updated successfully')
      setEditingClientId(null)
      setEditingAmount('')
      onClientsUpdated()
    } else {
      console.error('Failed to update the amount')
    }
  }

  const handleEditAmount = (clientId: string, currentAmount: string) => {
    setEditingClientId(clientId)
    setEditingAmount(currentAmount)
  }

  const deleteTransition = useDeleteTransition(
    () => {
      console.log('Deletion successful')
      onClientsUpdated()
    },
    error => {
      console.error('Deletion failed:', error.message)
    }
  )

  return (
    <>
      <ScrollArea className='h-[45vh] w-full rounded-3xl border border-violet-300'>
        <Table>
          <TableCaption>
            A list of your client&apos;s recent transitions
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className='rounded-3xl text-xs '>
            {clientsTransitionList?.map(client => (
              <TransitionRow
                key={client.id}
                client={client}
                onEdit={() => {
                  if (editingClientId === client.id) {
                    handleUpdateAmount(client.id)
                  } else {
                    handleEditAmount(client.id, client.amount)
                  }
                }}
                onDelete={deleteTransition}
                isEditing={editingClientId === client.id}
                editingAmount={editingAmount}
                setEditingAmount={setEditingAmount}
              />
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={5}>Individual Balance</TableCell>
            </TableRow>

            <TableRow>
              <TableCell colSpan={3} className='bg-violet-600 opacity-70'>
                {selectedClientName} {formattedBalance}
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell colSpan={3}>All Balance</TableCell>
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
