import { defineType, defineField, defineArrayMember } from 'sanity'
import { CogIcon } from '@sanity/icons/Cog'
import { GlobeIcon } from '@sanity/icons/Globe'
import { GithubIcon } from '@sanity/icons/Github'
import { LinkedinIcon } from '@sanity/icons/Linkedin'

export const globalSettings = defineType({
  name: 'globalSettings',
  title: 'Global Settings',
  type: 'document',
  icon: CogIcon,
  // Singleton: only one document of this type
  __experimental_actions: ['update', 'publish'],
  fields: [
    defineField({
      name: 'siteName',
      title: 'Site Name',
      type: 'string',
      initialValue: 'Ibeh Henry — Software Engineer',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'siteDescription',
      title: 'Site Description',
      type: 'text',
      rows: 3,
      initialValue: 'Software Engineering undergrad building systems, apps, scripts and games.',
    }),
    defineField({
      name: 'hero',
      title: 'Hero Section',
      type: 'object',
      fields: [
        defineField({
          name: 'name',
          title: 'Name',
          type: 'string',
          initialValue: 'Ibeh Henry',
        }),
        defineField({
          name: 'tagline',
          title: 'Tagline',
          type: 'array',
          of: [defineArrayMember({ type: 'block' })],
          initialValue: [
            {
              _type: 'block',
              children: [{ _type: 'span', text: 'I build ' }],
              markDefs: [],
            },
            {
              _type: 'block',
              children: [{ _type: 'span', text: 'systems', marks: ['strong'] }],
              markDefs: [],
            },
            {
              _type: 'block',
              children: [{ _type: 'span', text: ', ' }],
              markDefs: [],
            },
            {
              _type: 'block',
              children: [{ _type: 'span', text: 'apps & ' }],
              markDefs: [],
            },
            {
              _type: 'block',
              children: [{ _type: 'span', text: 'games', marks: ['strong'] }],
              markDefs: [],
            },
            {
              _type: 'block',
              children: [{ _type: 'span', text: '.' }],
              markDefs: [],
            },
          ],
        }),
        defineField({
          name: 'bio',
          title: 'Bio',
          type: 'text',
          rows: 4,
          initialValue: 'Software engineering undergrad obsessed with the layers between keyboard and kernel. I like sharp tools, small binaries, and shipping things that feel fast.',
        }),
        defineField({
          name: 'stats',
          title: 'Stats',
          type: 'array',
          of: [defineArrayMember({ type: 'object', fields: [
            defineField({ name: 'label', title: 'Label', type: 'string' }),
            defineField({ name: 'value', title: 'Value', type: 'string' }),
          ]})],
          initialValue: [
            { label: 'Years Coding', value: '4+' },
            { label: 'Shipped Projects', value: '20+' },
            { label: 'Tabs Open', value: '∞' },
          ],
        }),
      ],
    }),
    defineField({
      name: 'socialLinks',
      title: 'Social Links',
      type: 'object',
      fields: [
        defineField({
          name: 'github',
          title: 'GitHub',
          type: 'url',
          icon: GithubIcon,
        }),
        defineField({
          name: 'linkedin',
          title: 'LinkedIn',
          type: 'url',
          icon: LinkedinIcon,
        }),
        defineField({
          name: 'twitter',
          title: 'Twitter/X',
          type: 'url',
        }),
        defineField({
          name: 'email',
          title: 'Email',
          type: 'string',
        }),
      ],
    }),
    defineField({
      name: 'stackCategories',
      title: 'Stack Categories',
      type: 'array',
      of: [defineArrayMember({
        type: 'object',
        fields: [
          defineField({ name: 'title', title: 'Title', type: 'string' }),
          defineField({ name: 'icon', title: 'Icon Name', type: 'string', description: 'Lucide icon name (e.g., Cpu, Code2, Gamepad2)' }),
          defineField({ name: 'highlight', title: 'Highlight', type: 'boolean', initialValue: false }),
          defineField({ name: 'items', title: 'Items', type: 'array', of: [defineArrayMember({ type: 'string' })] }),
        ],
      })],
      initialValue: [
        { title: 'Systems', icon: 'Cpu', highlight: false, items: ['Rust', 'C / C++', 'Go', 'Linux internals', 'Networking'] },
        { title: 'Apps', icon: 'Code2', highlight: true, items: ['TypeScript', 'React', 'Node.js', 'Postgres', 'Tauri'] },
        { title: 'Games & Scripts', icon: 'Gamepad2', highlight: false, items: ['Godot', 'Python', 'Bash', 'Shaders', 'Automation'] },
      ],
    }),
    defineField({
      name: 'experience',
      title: 'Experience Timeline',
      type: 'array',
      of: [defineArrayMember({
        type: 'object',
        fields: [
          defineField({ name: 'year', title: 'Year', type: 'string' }),
          defineField({ name: 'title', title: 'Title', type: 'string' }),
          defineField({ name: 'organization', title: 'Organization', type: 'string' }),
        ],
      })],
      initialValue: [
        { year: '2026', title: 'Software Engineering, B.Sc.', organization: 'Undergraduate — in progress' },
        { year: '2025', title: 'Open source maintainer', organization: 'Systems tooling + dev CLIs' },
        { year: '2024', title: 'Freelance developer', organization: 'Apps, scripts, small games' },
        { year: '2023', title: 'Started building things that ship', organization: 'First real deployments' },
      ],
    }),
    defineField({
      name: 'contact',
      title: 'Contact Section',
      type: 'object',
      fields: [
        defineField({ name: 'heading', title: 'Heading', type: 'string', initialValue: "Got a problem worth solving? Let's talk." }),
        defineField({ name: 'subtext', title: 'Subtext', type: 'text', rows: 2, initialValue: 'Open to internships, freelance work, and interesting collaborations. Fastest reply is email — I check it more than I\'d like to admit.' }),
        defineField({ name: 'email', title: 'Contact Email', type: 'string', initialValue: 'hello@ibehhenry.dev' }),
        defineField({ name: 'githubUrl', title: 'GitHub Profile URL', type: 'url', initialValue: 'https://github.com' }),
      ],
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Global Settings' }
    },
  },
})