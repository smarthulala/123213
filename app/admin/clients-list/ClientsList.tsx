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
import { ScrollArea } from '@/components/ui/scroll-area'
import { ToggleGroup } from '@/components/ui/toggle-group'
import { createClient } from '@/utils/supabase/client'
import { ToggleGroupItem } from '@radix-ui/react-toggle-group'
import Image from 'next/image'
import { FC } from 'react'

const supabase = createClient()
interface Props {
  clientsList: Clients[] | null
  onClientsUpdated: () => void
  handleOnSelectClient: (clientId: string, clientName: string) => void
}

const ClientsList: FC<Props> = ({
  clientsList,
  onClientsUpdated,
  handleOnSelectClient
}) => {
  const handleDelete = async (clientId: string) => {
    try {
      const { error: transitionError } = await supabase
        .from('transition')
        .delete()
        .eq('client_id', clientId)

      if (transitionError) {
        throw new Error(transitionError.message)
      }

      const { error: clientError } = await supabase
        .from('client')
        .delete()
        .eq('id', clientId)

      if (clientError) {
        throw new Error(clientError.message)
      }
      onClientsUpdated()
    } catch (error) {
      console.error('Error in deletion process:', error)
    }
  }

  const filteredClients = clientsList?.filter(
    client =>
      client.name !== 'Expense' &&
      client.name !== 'Insurance' &&
      client.name !== 'Commission'
  )

  return (
    <>
      <ScrollArea className='h-[45vh] w-full rounded-3xl border border-violet-300 py-4'>
        <ToggleGroup type='single' className='grid grid-cols-2 gap-4'>
          {filteredClients?.map(clients => (
            <ToggleGroupItem
              value={clients.name}
              key={clients.id}
              className='flex w-full items-center justify-center gap-2 border-gray-400 text-black'
              onClick={() => handleOnSelectClient(clients.id, clients.name)}
            >
              <div className='w-1/2 cursor-pointer rounded-2xl bg-gradient-to-br from-cyan-300 to-blue-500 px-3 py-1 text-left text-xs'>
                {clients.name}
              </div>
              <AlertDialog>
                <AlertDialogTrigger className=''>
                  <Image
                    src='/icons8-delete.svg'
                    alt='admin'
                    width={28}
                    height={40}
                  />
                </AlertDialogTrigger>

                <AlertDialogContent className='rounded-3xl'>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will{' '}
                      <span className='text-red-600'>PERMANENTLY REMOVE </span>
                      this Client{' '}
                      <span className='text-red-600'>
                        AND All RELATED RECORDS
                      </span>{' '}
                      from your database servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className='rounded-3xl'>
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction className='cursor-pointer  rounded-3xl bg-red-700'>
                      <button
                        type='button'
                        onClick={() => handleDelete(clients.id)}
                      >
                        Delete This Client
                      </button>
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </ScrollArea>
    </>
  )
}

export default ClientsList
