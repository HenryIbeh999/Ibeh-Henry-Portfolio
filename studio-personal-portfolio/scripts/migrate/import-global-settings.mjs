import { createClient } from '@sanity/client'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '../../.env' })

const client = createClient({
  projectId: 'zmh5gtp5',
  dataset: 'production',
  apiVersion: '2026-02-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
})

const globalSettings = {
  _id: 'globalSettings',
  _type: 'globalSettings',
  siteName: 'Ibeh Henry — Software Engineer',
  siteDescription: 'Software Engineering undergrad building systems, apps, scripts and games.',
  hero: {
    name: 'Ibeh Henry',
    tagline: [
      { _type: 'block', children: [{ _type: 'span', text: 'I build ' }] },
      { _type: 'block', children: [{ _type: 'span', text: 'systems', marks: ['strong'] }] },
      { _type: 'block', children: [{ _type: 'span', text: ', ' }] },
      { _type: 'block', children: [{ _type: 'span', text: 'apps & ' }] },
      { _type: 'block', children: [{ _type: 'span', text: 'games', marks: ['strong'] }] },
      { _type: 'block', children: [{ _type: 'span', text: '.' }] },
    ],
    bio: 'Software engineering undergrad obsessed with the layers between keyboard and kernel. I like sharp tools, small binaries, and shipping things that feel fast.',
    stats: [
      { label: 'Years Coding', value: '4+' },
      { label: 'Shipped Projects', value: '20+' },
      { label: 'Tabs Open', value: '∞' },
    ],
  },
  socialLinks: {
    github: 'https://github.com',
    linkedin: 'https://linkedin.com',
    twitter: 'https://twitter.com',
    email: 'hello@ibehhenry.dev',
  },
  stackCategories: [
    { title: 'Systems', icon: 'Cpu', highlight: false, items: ['Rust', 'C / C++', 'Go', 'Linux internals', 'Networking'] },
    { title: 'Apps', icon: 'Code2', highlight: true, items: ['TypeScript', 'React', 'Node.js', 'Postgres', 'Tauri'] },
    { title: 'Games & Scripts', icon: 'Gamepad2', highlight: false, items: ['Godot', 'Python', 'Bash', 'Shaders', 'Automation'] },
  ],
  experience: [
    { year: '2026', title: 'Software Engineering, B.Sc.', organization: 'Undergraduate — in progress' },
    { year: '2025', title: 'Open source maintainer', organization: 'Systems tooling + dev CLIs' },
    { year: '2024', title: 'Freelance developer', organization: 'Apps, scripts, small games' },
    { year: '2023', title: 'Started building things that ship', organization: 'First real deployments' },
  ],
  contact: {
    heading: "Got a problem worth solving? Let's talk.",
    subtext: "Open to internships, freelance work, and interesting collaborations. Fastest reply is email — I check it more than I'd like to admit.",
    email: 'hello@ibehhenry.dev',
    githubUrl: 'https://github.com',
  },
}

async function importGlobalSettings() {
  console.log('Importing global settings to Sanity...')
  
  try {
    const result = await client.createOrReplace(globalSettings)
    console.log(`✓ Created globalSettings (${result._id})`)
  } catch (error) {
    console.error('✗ Failed to create globalSettings:', error)
  }
  
  console.log('Migration complete!')
}

importGlobalSettings().catch(console.error)