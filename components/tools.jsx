import editorjsCodeflaskM from '@calumk/editorjs-codeflask'
import CheckList from '@editorjs/checklist'
import Delimiter from '@editorjs/delimiter'
import Embed from '@editorjs/embed'
import Header from '@editorjs/header'
import InlineCode from '@editorjs/inline-code'
import LinkTool from '@editorjs/link'
import List from '@editorjs/list'
import Marker from '@editorjs/marker'
import Paragraph from '@editorjs/paragraph'
import Quote from '@editorjs/quote'
import Raw from '@editorjs/raw'
import Table from '@editorjs/table'
import Underline from '@editorjs/underline'
import Strikethrough from '@sotaproject/strikethrough'
import Alert from 'editorjs-alert'
import Annotation from 'editorjs-annotation'
import ChangeCase from 'editorjs-change-case'
import AlignmentTuneTool from 'editorjs-text-alignment-blocktune'
import Color from 'editorjs-text-color-plugin'

export const EDITOR_JS_TOOLS = {
  checklist: {
    class: CheckList,
    inlineToolbar: true
  },
  embed: Embed,
  paragraph: {
    class: Paragraph,
    inlineToolbar: true,
    tunes: ['anyTuneName']
  },
  anyTuneName: {
    class: AlignmentTuneTool,
    config: {
      default: 'left',
      blocks: {
        header: 'center',
        list: 'right'
      }
    },
    inlineToolbar: ['center']
  },
  underline: {
    class: Underline,
    shortcut: 'CTRL+O'
  },
  Color: {
    class: Color,
    config: {
      colorCollections: ['#EC7878', '#9C27B0', '#673AB7', '#3F51B5', '#0070FF', '#03A9F4', '#00BCD4', '#4CAF50', '#8BC34A', '#CDDC39', '#FFF'],
      defaultColor: '#FF1300',
      type: 'text',
      customPicker: true
    }
  },
  annotation: Annotation,
  marker: Marker,
  strikethrough: Strikethrough,
  raw: Raw,
  inlineCode: {
    class: InlineCode,
    shortcut: 'CTRL+M'
  },
  alert: Alert,
  code: editorjsCodeflaskM,
  quote: Quote,
  delimiter: Delimiter,
  header: {
    class: Header,
    tunes: ['anyTuneName']

  },
  linkTool: LinkTool,
  table: Table,
  list: List,
  changeCase: {
    class: ChangeCase,
    showLocaleOption: true
  }
}
