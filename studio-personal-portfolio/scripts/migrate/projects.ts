import { createClient } from '@sanity/client'
import { defineMigration, at, setIfMissing } from 'sanity/migrate'

// Migration script to import hardcoded projects from frontend
// Run with: npx sanity@latest migration run migrate-projects --no-dry-run

const projects = [
  {
    _id: 'project-1',
    _type: 'project',
    title: 'Packet Forge',
    slug: { _type: 'slug', current: 'packet-forge' },
    description: [
      {
        _type: 'block',
        children: [{ _type: 'span', text: 'Low-level packet inspection toolkit with a scriptable rule engine and zero-copy parsing.' }],
      },
    ],
    techStack: ['Rust', 'Tokio', 'eBPF'],
    githubUrl: 'https://github.com',
    dataAdded: '2024-01-15',
  },
  {
    _id: 'project-2',
    _type: 'project',
    title: 'Glyph',
    slug: { _type: 'slug', current: 'glyph' },
    description: [
      {
        _type: 'block',
        children: [{ _type: 'span', text: 'Local-first note editor with git-backed sync, palette-driven UX and vim keymaps.' }],
      },
    ],
    techStack: ['Tauri', 'React', 'SQLite'],
    githubUrl: 'https://github.com',
    dataAdded: '2024-03-20',
  },
  {
    _id: 'project-3',
    _type: 'project',
    title: 'Loop Runner',
    slug: { _type: 'slug', current: 'loop-runner' },
    description: [
      {
        _type: 'block',
        children: [{ _type: 'span', text: 'Endless runner where the level loops around a torus. Original soundtrack + shaders.' }],
      },
    ],
    techStack: ['Godot', 'GLSL', 'GDScript'],
    githubUrl: 'https://github.com',
    dataAdded: '2023-11-10',
  },
  {
    _id: 'project-4',
    _type: 'project',
    title: 'shellmate',
    slug: { _type: 'slug', current: 'shellmate' },
    description: [
      {
        _type: 'block',
        children: [{ _type: 'span', text: 'A pack of composable shell utilities for provisioning dev boxes in under 60 seconds.' }],
      },
    ],
    techStack: ['Bash', 'Nix', 'CLI'],
    githubUrl: 'https://github.com',
    dataAdded: '2023-09-01',
  },
]

export default defineMigration({
  title: 'Import hardcoded projects from frontend',
  documentTypes: ['project'],
  migrate: {
    async document(doc, context) {
      // This migration creates new documents, doesn't modify existing ones
      return []
    },
  },
  // We'll use a custom approach - create the documents directly
})

// Standalone import function
async function importProjects() {
  const client = createClient({
    projectId: 'zmh5gtp5',
    dataset: 'production',
    apiVersion: '2026-02-01',
    token: process.env.SANITY_API_TOKEN,
    useCdn: false,
  })

  console.log('Importing projects...')
  
  for (const project of projects) {
    try {
      const result = await client.createOrReplace(project)
      console.log(`✓ Created ${project.title} (${result._id})`)
    } catch (error) {
      console.error(`✗ Failed to create ${project.title}:`, error)
    }
  }
  
  console.log('Migration complete!')
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  importProjects().catch(console.error)
}