import useIns from '@/hooks/useIns'
import { formatCurrency } from '@/utils/formatCurrency/formatCurrency'
import { format } from 'date-fns'

const Ins = () => {
  const { insSum, ins } = useIns()
  const filteredIns = ins?.filter(inss => inss.transition_type === 'Insurance')

  return (
    <>
      <span>Total Insurance: {formatCurrency(insSum)}</span>
      <div className='flex gap-1'>
        {filteredIns?.map(inss => (
          <div
            key={inss.amount}
            className=' flex aspect-square h-[100px] flex-col rounded-xl border border-violet-300 p-1 text-center text-[18px] leading-[1.2]'
          >
            <span>{inss.name}</span>
            <span className='m-auto text-[16px]'>
              {format(new Date(inss.created_at), 'HH:mm')}
            </span>
            <span className='font-bold'>{formatCurrency(inss.amount)}</span>
          </div>
        ))}
      </div>
    </>
  )
}

export default Ins
