import DocumentEditor from '@/app/(main)/_components/doc-id-page'
import { getFiles } from '@/app/helpers/utils'

export default async function DocumentIdPage({ params }) {
  const files = getFiles()
  return (
    <DocumentEditor params={params} files={files} />
  )
}
