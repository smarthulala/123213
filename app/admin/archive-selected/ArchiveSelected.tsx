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
import { FC } from 'react'

interface Props {
  archiveAllTransitionsForClient: () => void
  // selectedClientId: string | null
}

const ArchiveSelected: FC<Props> = ({
  archiveAllTransitionsForClient
  // selectedClientId
}) => {
  return (
    <div>
      <AlertDialog>
        <AlertDialogTrigger className='w-full cursor-pointer rounded-3xl border border-violet-300 py-2  text-xl text-red-500'>
          Archive Selected
        </AlertDialogTrigger>

        <AlertDialogContent className='rounded-3xl'>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will{' '}
              <span className='text-xl font-bold'>
                all transactions for selected client
              </span>{' '}
              from your database servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className='rounded-3xl'>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction className='cursor-pointer  rounded-3xl bg-red-700'>
              <button type='button' onClick={archiveAllTransitionsForClient}>
                Archive Selected
              </button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default ArchiveSelected
