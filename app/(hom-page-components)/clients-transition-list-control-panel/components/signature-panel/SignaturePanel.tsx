import { Button } from '@/components/ui/button'
import React, { FC } from 'react'
import SignatureCanvas from 'react-signature-canvas'

interface Props {
  sigPad: React.MutableRefObject<SignatureCanvas | null>
  onClearSignature: () => void
}

const SignaturePanel: FC<Props> = ({ onClearSignature, sigPad }) => {
  return (
    <div>
      <div className='rounded-3xl border border-zinc-500 '>
        <SignatureCanvas
          penColor='white'
          ref={sigPad}
          canvasProps={{
            className: 'sigCanvas max-w-[65vw] mx-auto min-h-[16vh]'
          }}
        />
      </div>
      <div className='mt-2 flex items-end justify-center'>
        <Button
          type='button'
          onClick={onClearSignature}
          className='rounded-3xl hover:bg-violet-600/20'
          variant='ghost'
        >
          Clear Signature
        </Button>
      </div>
    </div>
  )
}

export default SignaturePanel
