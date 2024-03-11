import Loading from '@/app/loading'
import { Card } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import useAllBalance from '@/hooks/useAllBalance'
import { formatCurrency } from '@/utils/formatCurrency/formatCurrency'

const DailyCheckout = () => {
  const {
    loading,
    error,
    commission,
    insurance,
    tip,
    expense,
    totalTopUp,
    totalCashOut,
    balance
  } = useAllBalance()

  return (
    <>
      {loading && <Loading />}
      {error && <div>Error loading signature: {error}</div>}
      <Card className='h-[45vh] overflow-scroll rounded-3xl border-violet-300'>
        <Table>
          <TableHeader>
            <TableRow className='border-violet-300'>
              <TableHead className='w-full'>Type</TableHead>

              <TableHead className='text-right'>Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow className='border-violet-300'>
              <TableCell className='py-[10px] font-medium'>Top Up</TableCell>
              <TableCell className='py-0 text-right font-bold'>
                {formatCurrency(totalTopUp)}
              </TableCell>
            </TableRow>
            <TableRow className='border-violet-300'>
              <TableCell className='py-[10px] font-medium'>Cash Out</TableCell>
              <TableCell className='py-0 text-right font-bold'>
                {formatCurrency(totalCashOut)}
              </TableCell>
            </TableRow>
            <TableRow className='border-violet-300'>
              <TableCell className='py-[10px] font-medium'>
                Commission
              </TableCell>
              <TableCell className='py-0 text-right font-bold'>
                {formatCurrency(commission)}
              </TableCell>
            </TableRow>
            <TableRow className='border-violet-300'>
              <TableCell className='py-[10px] font-medium'>Insurance</TableCell>
              <TableCell className='py-0 text-right font-bold'>
                {formatCurrency(insurance)}
              </TableCell>
            </TableRow>
            <TableRow className='border-violet-300'>
              <TableCell className='py-[10px] font-medium'>Tips</TableCell>
              <TableCell className='py-0 text-right font-bold'>
                {formatCurrency(tip)}
              </TableCell>
            </TableRow>
            <TableRow className='hidden border-violet-300'>
              <TableCell className='py-[10px] font-medium'>
                Expense (Excluded from balance calculation)
              </TableCell>
              <TableCell className='py-0 text-right font-bold'>
                {formatCurrency(expense)}
              </TableCell>
            </TableRow>
          </TableBody>
          <TableFooter className='border-violet-300'>
            <TableRow>
              <TableCell colSpan={1}>Total Balance</TableCell>
              <TableCell className='text-right font-bold'>
                {formatCurrency(balance)}
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </Card>
    </>
  )
}

export default DailyCheckout
