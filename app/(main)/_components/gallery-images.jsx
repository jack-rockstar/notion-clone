import Spinner from '@/components/spinner'
import { cn, getFileByUrl } from '@/lib/utils'
import { coverImageStore } from '@/store/cover-image-store'
import Image from 'next/image'

const DIRECTORIES_LABEL = {
  colors: 'Abstractos y degradados',
  'museo-art': 'Museo Metropolitano de Arte: Patrones',
  'museo-jap': 'Museo Metropolitano de Arte: arte japonés',
  'museo-rijk': 'Rijksmuseum',
  nasa: 'Archivo de la NASA',
  space: 'Telescopio James Webb'
}

export default function GalleryImage({ images, onChange, isSubmiting }) {
  const coverImage = coverImageStore()

  const onClick = async (url) => {
    if (isSubmiting) return
    coverImage.setLoadImage(url)
    const file = await getFileByUrl(url)
    onChange(file)
  }

  return (
    <>
      {
          images.map((e, _) => {
            const [name] = Object.keys(e)
            const [files] = Object.values(e)
            return (
              <article key={_}>
                <span className='block m-2 text-xs text-left text-muted-foreground'>{DIRECTORIES_LABEL[name]}</span>

                <section className='grid h-auto grid-cols-4 gap-2 m-2'>
                  {
                  files.map((path) => {
                    return (
                      <article
                        onClick={() => onClick(path)} key={path} className={cn('relative h-20 rounded-lg cursor-pointer bg-slate-700',
                          isSubmiting && 'cursor-not-allowed'
                        )}
                      >
                        {
                          coverImage.getLoadImage() !== path
                            ? (
                              <Image
                                className='w-full h-20 rounded-lg'
                                src={path}
                                alt=''
                                fill
                                sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                              />
                              )
                            : (
                              <div className='relative w-full h-full'>
                                <div className='absolute top-0 left-0 flex items-center justify-center w-full h-full bg-black/70 z-[99999] rounded-lg'>
                                  <Spinner size='md' />
                                </div>
                                <Image
                                  className='w-full h-20 rounded-lg'
                                  src={path}
                                  alt=''
                                  fill
                                  sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                                />
                              </div>
                              )

                        }

                      </article>
                    )
                  })
                }
                </section>

              </article>
            )
          })
        }
    </>

  )
}
