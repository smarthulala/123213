'use client'

import Loading from '@/app/loading'
import CheckUnachived from '@/components/CheckUnachived'
import useCheckArchive from '@/hooks/useCheckArchive'
import useClientTransitions from '@/hooks/useClientTransitions'
import useClients from '@/hooks/useClients'
import extractErrorMessage from '@/utils/error-utils/errorUtils'
import { createClient } from '@/utils/supabase/client'
import { useState } from 'react'
import DailyCheckout from '../(hom-page-components)/daily-checkout'
import AddClientForm from './add-client-form'
import Alerts from './alerts'
import AllBalanceForAdmin from './all-balance-for-admin'
import ArchiveAll from './archive-all/ArchiveAll'
import ArchiveSelected from './archive-selected'
import ClientsList from './clients-list'
import ClientsTransitionList from './clients-transition-list'
import Expense from './expense'
import Comm from './Comm'
import Ins from './Ins'
import Wage from './wage'

const supabase = createClient()

export default function Page() {
  const hasOldUnarchived = useCheckArchive()
  const [clientName, setClientName] = useState('')
  const [errors, setError] = useState<string | null>(null)
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null)
  const [selectedClientName, setSelectedClientName] = useState<string | null>(
    null
  )

  const {
    clientsTransitionList,
    isLoading: isLoadingTransitions,
    error: errorTransitions,
    mutate: mutateClientsTransition
  } = useClientTransitions(selectedClientId)

  const {
    clients: clientsList,
    isLoading: isLoadingClients,
    error: errorClients,
    mutate: mutateClients
  } = useClients()

  const handleSubmit = async (formData: { clientName: string }) => {
    setError(null)

    try {
      const { error } = await supabase
        .from('client')
        .insert([{ name: formData.clientName }])
      if (error) {
        // eslint-disable-next-line @typescript-eslint/no-throw-literal
        throw error.code
      }
      mutateClients()
    } catch (err) {
      if (err === '23505') {
        setError('Client name already exists')
        setTimeout(() => setError(null), 2000)
      } else {
        setError('An error occurred')
      }
    }
  }

  const handleOnSelectClient = (
    clientId: string,
    SelectedClientName: string
  ) => {
    setSelectedClientId(clientId)
    setSelectedClientName(SelectedClientName)
  }

  const isLoading = isLoadingTransitions || isLoadingClients
  const error = errorTransitions || errorClients

  if (isLoading) {
    return <Loading />
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  const archiveAllTransitionsForClient = async () => {
    if (!selectedClientId) {
      console.error('No client selected')
      return
    }

    try {
      const { error: fetchError } = await supabase
        .from('transition')
        .update({ archive: true })
        .eq('client_id', selectedClientId)

      if (fetchError) {
        throw new Error(fetchError.message)
      }

      mutateClientsTransition()
    } catch (fetchError) {
      setError(extractErrorMessage(fetchError))
    }
  }

  return (
    <div className='grid grid-cols-2 gap-4 p-4 sm:grid-cols-3'>
      <CheckUnachived hasOldUnarchived={hasOldUnarchived} />

      <div className='col-span-2 hidden h-full w-full overflow-scroll rounded-lg sm:col-span-3'>
        <ClientsTransitionList
          clientsTransitionList={clientsTransitionList}
          onClientsUpdated={mutateClientsTransition}
          selectedClientName={selectedClientName}
        />
      </div>

      <div className='h-full rounded-lg '>
        <ClientsList
          clientsList={clientsList}
          onClientsUpdated={mutateClients}
          handleOnSelectClient={handleOnSelectClient}
        />
      </div>

      <div className='flex max-h-[45vh] flex-col gap-4 overflow-scroll rounded-3xl border border-violet-300 p-4'>
        <AddClientForm
          clientName={clientName}
          setClientName={setClientName}
          onSubmit={handleSubmit}
        />

        {selectedClientName ? (
          <div className='w-full rounded-3xl border border-violet-300 py-1 text-center text-[26px] leading-[2]'>
            <span className=''>Selected Client :</span>{' '}
            <span className='text-violet-300'>{selectedClientName}</span>
          </div>
        ) : (
          <div className='w-full rounded-3xl border border-violet-300 p-1 text-center leading-[1]'>
            <span className='text-xl'>Select client on left list</span>
          </div>
        )}

        <ArchiveSelected
          archiveAllTransitionsForClient={archiveAllTransitionsForClient}
        />

        <ArchiveAll />

        <Alerts error={errors} />
      </div>

      <div className='col-span-2 mt-10 rounded-3xl sm:col-span-1 sm:mt-0'>
        <DailyCheckout />
      </div>

      <div className='col-span-2 mt-10 rounded-3xl border border-violet-300 p-4 sm:col-span-3 sm:mt-0'>
        <AllBalanceForAdmin />
      </div>

      <div className='col-span-2 mt-10 rounded-3xl border border-violet-300 p-4 sm:col-span-3 sm:mt-0'>
        <Comm />
      </div>

      <div className='col-span-2 mt-10 rounded-3xl border border-violet-300 p-4 sm:col-span-3 sm:mt-0'>
        <Ins />
      </div>

      <div className='col-span-2 mt-10 rounded-3xl border border-violet-300 p-4 sm:col-span-3 sm:mt-0'>
        <Expense />
      </div>
      <div className='col-span-2 mt-10 rounded-3xl border border-violet-300 p-4 sm:col-span-3 sm:mt-0'>
        <Wage />
      </div>
    </div>
  )
}
