import { FC } from 'react'
import z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Alerts from '@/app/admin/alerts'
import Image from 'next/image'
import Link from 'next/link'

interface Props {
  clientName: string
  setClientName: (clientName: string) => void
  onSubmit: (data: z.infer<typeof FormSchema>) => void
}

const FormSchema = z.object({
  clientName: z.string().min(1, 'Client name is required')
})

const Form: FC<Props> = ({ clientName, onSubmit }) => {
  const onValidSubmit = (data: z.infer<typeof FormSchema>) => {
    onSubmit(data)
  }

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      clientName
    }
  })

  return (
    <div className='flex h-full flex-col items-center justify-between gap-4'>
      <form onSubmit={handleSubmit(onValidSubmit)} className='w-full'>
        <div className='mt-2 flex flex-col gap-2'>
          <div className='flex gap-2'>
            <input
              type='text'
              {...register('clientName')}
              className='w-full rounded-3xl px-3 py-2 text-xl text-gray-900 placeholder:text-gray-400'
              placeholder='Add Client'
            />

            <button type='submit'>
              <Image src='/icons8-add.svg' alt='admin' width={28} height={28} />
            </button>
          </div>

          {errors.clientName && (
            <Alerts error={errors.clientName.message || null} />
          )}
        </div>
      </form>
      <div className='flex w-full items-center justify-center text-2xl'>
        <Link href='/' className='w-full'>
          <div className='flex h-10 items-center justify-center gap-2 rounded-3xl border border-violet-300'>
            <p>Home</p>
            <Image
              src='/icons8-back.svg'
              alt='admin'
              width={20}
              height={20}
              className='motion-safe:animate-bounce-x'
            />
          </div>
        </Link>
      </div>
    </div>
  )
}

export default Form
