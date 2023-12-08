import GalleryImage from '@/app/(main)/_components/gallery-images'
import { SingleImageDropzone } from '@/components/single-image-dropzone'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { api } from '@/convex/_generated/api'
import { useEditor } from '@/hooks/use-editor'
import { useEdgeStore } from '@/lib/edgestore'
import { coverImageStore } from '@/store/cover-image-store'
import { useMutation } from 'convex/react'
import { ImageIcon } from 'lucide-react'
import { useParams } from 'next/navigation'
import { useState } from 'react'

const TABS_MENU = [
  {
    label: 'Gallery',
    value: 'gallery'
  },
  {
    label: 'Upload',
    value: 'upload'
  },
  {
    label: 'Unsplash',
    value: 'unsplash'
  }
]

export default function ButtonCover({ replaceUrl = undefined }) {
  const params = useParams()
  const [file, setFile] = useState()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const coverImage = coverImageStore()
  const update = useMutation(api.documents.update)
  const { edgestore } = useEdgeStore()
  const editor = useEditor()
  const images = coverImage.getGallery()

  const onClose = () => {
    setFile(undefined)
    setIsSubmitting(false)
    coverImage.onClose()
  }

  const onChange = async (file) => {
    if (file) {
      setIsSubmitting(true)
      setFile(file)

      const res = await edgestore.publicFiles.upload({
        file,
        options: {
          replaceTargetUrl: replaceUrl
        }
      })

      console.log(editor.getDoc())
      await update({
        id: editor.getDoc() ?? params.documentId,
        coverImage: res.url
      })
      onClose()
      coverImage.setLoadImage()
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className='text-xs text-muted-foreground'
          variant='outline'
          size='sm'
        >
          <ImageIcon className='w-4 h-4' />
          Change cover
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className='w-[490px] ml-2 max-w-[calc(100vw-24px)] h-auto custom-srollbar  bg-white dark:bg-[#191919] mb-10'
        align='end'
        alignOffset={6}
        forceMount
      >
        <Tabs defaultValue='gallery' className='w-full'>
          <TabsList className='flex justify-between  bg-[#191919] w-full custom-srollbar'>
            <div className='flex items-center justify-start gap-x-2'>
              {
                TABS_MENU.map((tab) => (
                  <TabsTrigger value={tab.value} key={tab.value} className='hover:bg-accent data-[state=active]:bg-white/10'>
                    {tab.label}
                  </TabsTrigger>
                ))
              }
            </div>

            <Button
              className='self-center py-1.5 float-right'
              variant='ghost'
              size='sm'
            >
              Eliminar
            </Button>
          </TabsList>
          <DropdownMenuSeparator />

          <TabsContent value='gallery' className='mt-0 overflow-y-auto custom-srollbar h-80'>
            <GalleryImage images={images} onChange={onChange} isSubmiting={isSubmitting} />
          </TabsContent>
          <TabsContent value='upload' className='h-auto p-4'>
            <SingleImageDropzone
              className='w-full outline-none'
              disabled={isSubmitting}
              value={file}
              onChange={onChange}
            />
          </TabsContent>
          <TabsContent value='unsplash'>Change your unsplash here.</TabsContent>

        </Tabs>

      </DropdownMenuContent>
    </DropdownMenu>
  )
}
