import useComm from '@/hooks/useComm'
import { formatCurrency } from '@/utils/formatCurrency/formatCurrency'
import { format } from 'date-fns'

const Comm = () => {
  const { comm, comSum } = useComm()
  const filteredComm = comm?.filter(
    comms => comms.transition_type === 'Commission'
  )

  return (
    <>
      <span>Total Commission: {formatCurrency(comSum)}</span>
      <div className='flex gap-1'>
        {filteredComm?.map(comms => (
          <div
            key={comms.amount}
            className=' flex aspect-square h-[100px] flex-col rounded-xl border border-violet-300 p-1 text-center text-[18px] leading-[1.2]'
          >
            <span>{comms.name}</span>
            <span className='m-auto text-[16px]'>
              {format(new Date(comms.created_at), 'HH:mm')}
            </span>
            <span className='font-bold'>{formatCurrency(comms.amount)}</span>
          </div>
        ))}
      </div>
    </>
  )
}

export default Comm
