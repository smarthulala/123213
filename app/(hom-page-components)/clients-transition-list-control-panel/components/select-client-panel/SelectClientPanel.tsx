'use client'

import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import RecentClientsList from '@/app/(hom-page-components)/recent-clients-list'
import { FC } from 'react'
import { Badge } from '@/components/ui/badge'
import ClientsList from '@/app/(hom-page-components)/clients-list'

interface Props {
  selectedClientName: string | null
  recentClients: Clients[]
  clientsList: Clients[] | null
  handleOnSelectClient: (clientId: string, clientName: string) => void
}

const SelectClientPanel: FC<Props> = ({
  selectedClientName,
  recentClients,
  clientsList,
  handleOnSelectClient
}) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className='h-full bg-background text-foreground hover:bg-primary/0'>
          <div className='flex h-full justify-center'>
            <Badge
              variant={selectedClientName ? 'outline' : 'destructive'}
              className={`w-fit justify-center rounded-3xl p-1
                ${
                  selectedClientName
                    ? 'border-2 border-violet-500 px-6 text-4xl capitalize'
                    : 'px-10 text-xl'
                }
              `}
            >
              {selectedClientName || 'SELECT CLIENT FIRST !!'}
            </Badge>
          </div>
        </Button>
      </SheetTrigger>

      <SheetContent side='left' className='border-r-2 border-violet-500'>
        <RecentClientsList
          clientsList={recentClients}
          handleOnSelectClient={handleOnSelectClient}
        />

        <ClientsList
          clientsList={clientsList}
          handleOnSelectClient={handleOnSelectClient}
        />
      </SheetContent>
    </Sheet>
  )
}

export default SelectClientPanel
