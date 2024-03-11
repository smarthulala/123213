import { ScrollArea } from '@/components/ui/scroll-area'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { FC } from 'react'
import { v4 as uuidv4 } from 'uuid'

interface Props {
  clientsList: Clients[] | null
  handleOnSelectClient: (clientId: string, clientName: string) => void
}

const ClientsList: FC<Props> = ({ clientsList, handleOnSelectClient }) => {
  const filteredClients = clientsList?.filter(
    client =>
      client.name !== 'Expense' &&
      client.name !== 'Insurance' &&
      client.name !== 'Commission'
  )

  return (
    <>
      <ScrollArea className='grid h-72 rounded-md'>
        <ToggleGroup type='single' className='grid grid-cols-2 gap-4 py-4'>
          {filteredClients?.map(client => (
            <ToggleGroupItem
              value={client.name}
              type='button'
              key={uuidv4()}
              variant='outline'
              className='cursor-pointer rounded-2xl bg-gradient-to-br from-cyan-300 to-blue-500 p-2 capitalize'
              onClick={() => handleOnSelectClient(client.id, client.name)}
            >
              {client.name}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </ScrollArea>
    </>
  )
}

export default ClientsList
