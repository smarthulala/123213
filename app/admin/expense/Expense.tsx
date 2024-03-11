import useExpense from '@/hooks/useExpense'
import { formatCurrency } from '@/utils/formatCurrency/formatCurrency'
import { format } from 'date-fns'

const Expense = () => {
  const { sum, expenses } = useExpense()
  const filteredExpenses = expenses?.filter(
    expense => expense.transition_type === 'Expense'
  )

  return (
    <>
      <span>Total Expense: {formatCurrency(sum)}</span>
      <div className='flex gap-1'>
        {filteredExpenses?.map(expense => (
          <div
            key={expense.amount}
            className=' flex aspect-square h-[100px] flex-col rounded-xl border border-violet-300 p-1 text-center text-[18px] leading-[1.2]'
          >
            <span>{expense.name}</span>
            <span className='m-auto text-[16px]'>
              {format(new Date(expense.created_at), 'HH:mm')}
            </span>
            <span className='font-bold'>{formatCurrency(expense.amount)}</span>
          </div>
        ))}
      </div>
    </>
  )
}

export default Expense
