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
import useArchiveAll from '@/hooks/useArchiveAll'

const ArchiveAll = () => {
  const { mutate } = useArchiveAll()
  return (
    <div>
      <AlertDialog>
        <AlertDialogTrigger className='w-full cursor-pointer rounded-3xl border border-violet-300 py-2 text-xl text-red-500'>
          Archive All
        </AlertDialogTrigger>

        <AlertDialogContent className='rounded-3xl'>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will archive{' '}
              <span className='text-xl font-bold'>all transitions</span> from
              your database servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className='rounded-3xl'>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction className='cursor-pointer  rounded-3xl bg-red-700'>
              <button type='button' onClick={() => mutate()}>
                Archive All
              </button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default ArchiveAll
