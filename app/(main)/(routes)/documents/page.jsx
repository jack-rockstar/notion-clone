import { getFiles } from '@/app/helpers/utils'
import DocumentsPage from '../../_components/doc-page'

export default function MainPage() {
  const files = getFiles()
  return (
    <DocumentsPage files={files} />
  )
}
