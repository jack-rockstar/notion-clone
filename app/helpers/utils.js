import { readdirSync } from 'node:fs'
import path from 'path'

export const DIRECTORIES = [
  'colors',
  'museo-art',
  'museo-jap',
  'museo-rijk',
  'nasa',
  'space'
]

const root = process.cwd()
export const getFiles = () => {
  const images = DIRECTORIES.map((e) => {
    const directory = path.join(root, `public/cover/${e}`)
    const files = readdirSync(directory)
    const fileUrls = files.map((file) => path.join('/', `/cover/${e}`, file).replace(/\\/g, '/'))

    return {
      [e]: fileUrls
    }
  })
  return images
}
