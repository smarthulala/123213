import useSignOut from '@/hooks/useSignOut'
import Image from 'next/image'

const SignOutButton = () => {
  const signOut = useSignOut()

  return (
    <button type='button' onClick={signOut}>
      <div className='flex items-center gap-1'>
        <p>Logout</p>
        <Image src='/icons8-logout.svg' alt='admin' width={24} height={24} />
      </div>
    </button>
  )
}

export default SignOutButton
