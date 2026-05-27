export type DocsSection = {
  id: string
  title: string
  description: string
  blocks: DocsBlock[]
}

export type DocsBlock =
  | {
    type: 'text'
    title?: string
    body: string[]
  }
  | {
    type: 'list'
    title: string
    items: string[]
  }
  | {
    type: 'code'
    title: string
    language: string
    code: string
  }
