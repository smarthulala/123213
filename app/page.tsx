'use client'

import CheckUnachived from '@/components/CheckUnachived'
import UserInfoDisplay from '@/components/UserInfoDisplay'
import useCheckArchive from '@/hooks/useCheckArchive'
import useClientTransitions from '@/hooks/useClientTransitions'
import useClients from '@/hooks/useClients'
import useRecentClients from '@/hooks/useRecentClients'
import Image from 'next/image'
import { useState } from 'react'
import ClientsTransitionList from './(hom-page-components)/clients-transition-list'
import ClientsTransitionListControlPanel from './(hom-page-components)/clients-transition-list-control-panel'
import SelectClientPanel from './(hom-page-components)/clients-transition-list-control-panel/components/select-client-panel'
import AllBalanceForClient from './(hom-page-components)/all-balance-for-client'
import EmployeeSelection from './(hom-page-components)/employee-selection'

const Home = () => {
  const hasOldUnarchived = useCheckArchive()

  const [selectedClientId, setSelectedClientId] = useState<string | null>(null)
  const [selectedClientName, setSelectedClientName] = useState<string | null>(
    null
  )
  const {
    recentClients,
    isLoading: isLoadingRecent,
    error: errorRecent,
    mutate: RecentClients
  } = useRecentClients()

  const {
    clientsTransitionList,
    isLoading: isLoadingTransitions,
    error: errorTransitions,
    mutate: mutateClientsTransition
  } = useClientTransitions(selectedClientId)

  const {
    clients: clientsList,
    isLoading: isLoadingClients,
    error: errorClients
    // mutate: mutateClients
  } = useClients()

  const handleOnSelectClient = (clientId: string, clientName: string) => {
    setSelectedClientId(clientId)
    setSelectedClientName(clientName)
  }

  const isLoading = isLoadingRecent || isLoadingTransitions || isLoadingClients
  const error = errorRecent || errorTransitions || errorClients

  if (isLoading) {
    return (
      <div className='flex h-screen w-full items-center justify-center'>
        <Image
          alt='loading'
          src='/icons8-loading.svg'
          width={100}
          height={100}
          className='motion-safe:animate-spin '
        />
      </div>
    )
  }
  if (error) {
    return <div>Error: {error}</div>
  }

  return (
    <div className='flex h-screen items-center justify-center'>
      <div className='h-full px-3 py-2'>
        <CheckUnachived hasOldUnarchived={hasOldUnarchived} />
        <div className='flex justify-between'>
          <div className='flex h-32 items-end justify-start'>
            <SelectClientPanel
              selectedClientName={selectedClientName}
              handleOnSelectClient={handleOnSelectClient}
              recentClients={recentClients}
              clientsList={clientsList}
            />
          </div>

          <EmployeeSelection />

          <div className='flex items-center justify-end pb-2 pr-4'>
            <UserInfoDisplay />
          </div>
        </div>

        <div className='col-span-2'>
          <div className='mx-auto grid h-full max-h-screen grid-cols-1 gap-2'>
            {/* {selectedClientId && ( */}
            <div className='col-span-2'>
              <ClientsTransitionListControlPanel
                selectedClientName={selectedClientName}
                selectedClientId={selectedClientId}
                onClientsTransitionUpdated={mutateClientsTransition}
                onClientsUpdated={RecentClients}
                setSelectedClientId={setSelectedClientId}
                setSelectedClientName={setSelectedClientName}
              />
            </div>
            {/* )} */}

            <div className='col-span-2 mt-10 rounded-3xl border border-violet-300 p-4 sm:col-span-3 sm:mt-4'>
              <AllBalanceForClient />
            </div>

            <div className='col-span-2 mt-10 hidden rounded-3xl'>
              <ClientsTransitionList
                selectedClientName={selectedClientName}
                clientsTransitionList={clientsTransitionList}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
