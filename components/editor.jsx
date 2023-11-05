'use client'

import { useEdgeStore } from '@/lib/edgestore'
import '@blocknote/core/style.css'
import { BlockNoteView, useBlockNote } from '@blocknote/react'
import { useTheme } from 'next-themes'

export default function Editor({ onChange, initialContent, editable = undefined }) {
  const { resolvedTheme } = useTheme()
  const { edgestore } = useEdgeStore()
  const editor = useBlockNote({
    editable,
    initialContent: initialContent ? JSON.parse(initialContent) : undefined,
    onEditorContentChange: (editor) => {
      onChange(JSON.stringify(editor.topLevelBlocks, null, 2))
    },
    uploadFile: handleUpload
  })

  async function handleUpload (file) {
    const response = await edgestore.publicFiles.upload({
      file
    })

    return response.url
  }

  return (
    <div>
      <BlockNoteView
        editor={editor}
        theme={resolvedTheme}
      />
    </div>
  )
}
