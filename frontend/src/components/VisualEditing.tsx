import { enableVisualEditing } from '@sanity/visual-editing'
import { useLiveMode } from '@/lib/sanity/loader'
import { client } from '@/lib/sanity/client'
import { useEffect } from 'react'

export default function VisualEditing() {
  useEffect(() => enableVisualEditing(), [])
  useLiveMode({ client })
  return null
}