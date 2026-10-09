import { createClient } from '@sanity/client'
import { loadQuery, setServerClient } from './loader'
import { projectId, dataset, apiVersion, studioUrl, previewMode } from './env'

const readToken = process.env.SANITY_API_READ_TOKEN

const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: !previewMode,
  token: previewMode ? readToken : undefined,
  perspective: previewMode && readToken ? 'previewDrafts' : 'published',
  // Stega markers are invisible characters injected into every string, so they
  // are only safe while previewing against the Presentation tool.
  stega: previewMode ? { enabled: true, studioUrl } : false,
})

setServerClient(client)

export { loadQuery, client }