'use client'

import Navbar from '@/app/(main)/_components/navbar'
import { api } from '@/convex/_generated/api'
import { useEditor } from '@/hooks/use-editor'
import { useMutation, useQuery } from 'convex/react'
import dynamic from 'next/dynamic'
import { Suspense, useMemo } from 'react'
import CoverImage from '../cover-image'
import Spinner from '../spinner'
import Toolbar from '../toolbar'
import { Dialog, DialogContent, DialogHeader } from '../ui/dialog'

export default function EditorModal() {
  const Editor = useMemo(() => dynamic(() => import('@/components/editor'), { ssr: false }), [])
  const editor = useEditor()
  const update = useMutation(api.documents.update)

  const document = useQuery(api.documents.getById, {
    documentId: editor.getDoc()
  })

  const onChange = (content) => {
    update({
      id: editor.getDoc(),
      content
    })
  }

  const handleOnClose = () => editor.onClose()

  return (
    <Dialog open={editor.isOpen} onOpenChange={handleOnClose}>
      <DialogContent className='min-w-0 mx-auto sm:flex-1 md:min-w-[896px] lg:min-w-[896] xl:min-w-[896px] overflow-auto flex flex-col custom-scrollbar h-[calc(100%-144px)] dark:bg-[#191919] focus-visible:outline-none '>
        <DialogHeader className='py-3 border-b max-h-16'>
          <Navbar id={document?._id} />
        </DialogHeader>
        <div className='relative w-full'>
          <CoverImage url={document?.coverImage} inModal />
        </div>
        <div className='mx-8'>
          {document && <Toolbar initialData={document} />}
          <Suspense fallback={<div className='flex items-center justify-center h-32'> <Spinner size='lg' /></div>}>
            <Editor
              onChange={onChange}
              initialContent={null}
              fontFamily={document?.fontFamily}
              maxWidth={document?.maxWidth}
            />
          </Suspense>
        </div>
      </DialogContent>
    </Dialog>
  )
}
