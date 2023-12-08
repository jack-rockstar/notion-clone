import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export const getFileByUrl = async (url) => {
  try {
    const response = await fetch(url)
    const blob = await response.blob()
    const lastModified = new Date()
    const contentType = response.headers.get('content-type') || 'application/octet-stream'

    return new File([blob], url.split('/')[url.split('/').length - 1], { lastModified, type: contentType })
  } catch (error) {
    console.log(error)
    return null
  }
}
export const getRandomPath = (files) => {
  const randomObject = files[Math.floor(Math.random() * files.length)]

  const paths = Object.values(randomObject)[0]

  const randomPath = paths[Math.floor(Math.random() * paths.length)]

  return randomPath
}
