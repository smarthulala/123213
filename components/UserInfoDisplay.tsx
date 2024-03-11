import { Avatar, AvatarImage } from '@/components/ui/avatar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'
import useAccessControl from '@/hooks/useAccessControl'
import { createClient } from '@/utils/supabase/client'
import { User } from '@supabase/supabase-js'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import SignOutButton from './SignOutButton'
import { Badge } from './ui/badge'

const supabase = createClient()

const UserInfoDisplay = () => {
  const isUserAllowed = useAccessControl('ling.h.game@gmail.com')
  const [userInfo, setUserInfo] = useState<User | null>(null)

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user: fetchedUser },
        error
      } = await supabase.auth.getUser()
      if (!error && fetchedUser) {
        setUserInfo(fetchedUser)
      } else {
        console.error('Failed to fetch user:', error)
      }
    }

    fetchUser()
  }, [])

  if (!userInfo) {
    return (
      <Link href='/login'>
        <Badge variant='destructive' className='w-fit justify-center py-1 px-3'>
          sign in
        </Badge>
      </Link>
    )
  }

  return (
    <Popover>
      <PopoverTrigger>
        <Avatar className='h-7 w-7'>
          <AvatarImage src='https://github.com/shadcn.png' />
        </Avatar>
      </PopoverTrigger>

      <PopoverContent className='mr-2 mt-2 rounded-3xl border border-gray-400 text-xs'>
        <div>
          {isUserAllowed ? (
            <div className='mb-4 flex items-center justify-between'>
              <p>Admin User</p>
              <Link href='/admin'>
                <div className='flex items-center gap-1'>
                  <p>dashboard</p>
                  <Image
                    src='/icons8-dashboard.svg'
                    alt='admin'
                    width={24}
                    height={24}
                  />
                </div>
              </Link>
            </div>
          ) : (
            <div className='mb-4 flex items-center justify-between'>
              <p>Staff User</p>
            </div>
          )}
          <div className='flex items-center justify-between'>
            <p>{userInfo.email}</p>
            <SignOutButton />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default UserInfoDisplay
