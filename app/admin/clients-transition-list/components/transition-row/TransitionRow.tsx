// TransitionRow.js or within your ClientsTransitionList file

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
import { TableCell, TableRow } from '@/components/ui/table'
import useShowSignature from '@/hooks/useShowSignature'
import { format } from 'date-fns'
import Image from 'next/image'
import { FC, useState } from 'react'

interface Props {
  client: ClientsTransition
  onEdit: () => void
  onDelete: (clientId: string) => void
  isEditing: boolean
  editingAmount: string
  setEditingAmount: (amount: string) => void
}

const TransitionRow: FC<Props> = ({
  client,
  onEdit,
  onDelete,
  isEditing,
  editingAmount,
  setEditingAmount
}) => {
  const [showSignature, setShowSignature] = useState(false)
  const { signature, isLoading, error } = useShowSignature(
    showSignature ? client.id : null
  )

  const handleShowSignature = () => setShowSignature(!showSignature)

  return (
    <>
      <TableRow
        key={client.id}
        className='border-b-0 border-violet-300 bg-background text-foreground'
      >
        <TableCell className='font-medium'>{client.name}</TableCell>
        <TableCell className='text-nowrap'>
          <div>
            <div>{format(new Date(client.created_at), 'MM-dd-yy ')}</div>
            <div>{format(new Date(client.created_at), ' HH:mm')}</div>
          </div>
        </TableCell>
        <TableCell colSpan={3}>
          {isEditing ? (
            <input
              type='text'
              value={editingAmount}
              onChange={e => setEditingAmount(e.target.value)}
              className='mb-2 w-full rounded-3xl bg-gray-400 text-center text-black'
            />
          ) : (
            <div className='w-full px-3 py-1'>{client.amount}</div>
          )}
          <div className='flex justify-between gap-1'>
            <button
              type='button'
              className='w-1/3 cursor-pointer rounded-3xl bg-gradient-to-br from-cyan-300 to-blue-500'
              onClick={onEdit}
            >
              {isEditing ? 'Save' : 'Edit'}
            </button>
            <AlertDialog>
              <AlertDialogTrigger className='cursor-pointer rounded-3xl bg-red-700 px-1'>
                Delete
              </AlertDialogTrigger>

              <AlertDialogContent className='rounded-3xl'>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently remove
                    this record from your database servers.
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
                      onClick={() => onDelete(client.id)}
                    >
                      Delete this record
                    </button>
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </TableCell>
      </TableRow>

      <TableRow key={client.id} className='bg-background text-foreground'>
        <TableCell colSpan={4}>
          <div className='flex'>
            <button
              type='button'
              className='ml-2'
              onClick={handleShowSignature}
            >
              {showSignature ? (
                <div className='cursor-pointer rounded-2xl bg-gradient-to-br from-cyan-300 to-blue-500 px-3 py-1 text-left'>
                  Hide
                </div>
              ) : (
                <div className='cursor-pointer rounded-2xl bg-gradient-to-br from-cyan-300 to-blue-500 px-3 py-1 text-left'>
                  Show Signature
                </div>
              )}
            </button>
            <TableCell className='w-1/2'>{client.transition_type}</TableCell>

            {showSignature && signature && !isLoading && (
              <Image
                src={signature}
                alt='Signature'
                layout='fixed'
                width={100}
                height={100}
                style={{ marginTop: '10px' }}
              />
            )}
          </div>
        </TableCell>
      </TableRow>
    </>
  )
}

export default TransitionRow
