'use client'

import { useEdgeStore } from '@/lib/edgestore'
import EditorJs from '@editorjs/editorjs'
import Image from '@editorjs/image'
import DragDrop from 'editorjs-drag-drop'
import Undo from 'editorjs-undo'
import { useTheme } from 'next-themes'
import { useEffect, useRef } from 'react'
import { EDITOR_JS_TOOLS } from './tools'

export default function Editor({ onChange, initialContent, readOnly = false }) {
  const ref = useRef()
  const { resolvedTheme } = useTheme()
  const { edgestore } = useEdgeStore()
  const TOOLS = {
    ...EDITOR_JS_TOOLS,
    image: {
      class: Image,
      config: {
        uploader: {
          async uploadByFile(file) {
            try {
              const response = await edgestore.publicFiles.upload({
                file
              })
              return {
                success: 1,
                file: {
                  url: response.url
                }
              }
            } catch (error) {
              console.log(error)
              return {
                success: 0,
                file: {
                  url: null
                }
              }
            }
          }
        }
      }
    }
  }

  const initializeEditor = async () => {
    const initialData = []

    if (!ref.current) {
      const editor = new EditorJs({
        onReady: () => {
          // eslint-disable-next-line no-new
          new DragDrop(editor)
          const undo = new Undo({ editor })
          undo.initialize(initialData)
        },
        holder: 'editorjs',
        tools: TOOLS,
        onChange: save,
        logLevel: 'ERROR',
        placeholder: 'Pulsa «Tab» para mostrar los comandos…',
        readOnly,
        data: initialContent ? JSON.parse(initialContent) : undefined,
        autofocus: !readOnly
      })
      ref.current = editor
    }
  }

  useEffect(() => {
    initializeEditor().then(e => console.log('editor is ready'))
  }, [])

  function save() {
    if (ref.current) {
      ref.current.save().then((outData) => {
        sessionStorage.setItem('content', JSON.stringify(outData))
        onChange(JSON.stringify(outData, null, 2))
      })
    }
  }

  return (
    <article className={`editor-${resolvedTheme} mx-4 lg:mx-0`}>
      <div id='editorjs' className='px-4 lg:px-2' />
    </article>
  )
}
