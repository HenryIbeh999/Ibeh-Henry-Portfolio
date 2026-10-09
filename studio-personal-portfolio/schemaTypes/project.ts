import { defineType, defineField, defineArrayMember } from 'sanity'
import { CodeIcon } from '@sanity/icons/Code'
import { ImageIcon } from '@sanity/icons/Image'
import { LinkIcon } from '@sanity/icons/Link'
import { CalendarIcon } from '@sanity/icons/Calendar'
import { GithubIcon } from '@sanity/icons/Github'

export const project = defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  icon: CodeIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'array',
      of: [defineArrayMember({ type: 'block' })],
    }),
    defineField({
      name: 'techStack',
      title: 'Tech Stack',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
      options: { layout: 'tags' },
    }),
    defineField({
      name: 'githubUrl',
      title: 'GitHub URL',
      type: 'url',
      validation: (rule) =>
        rule.uri({ scheme: ['http', 'https'] }).error('Must be a valid URL starting with http:// or https://'),
    }),
    defineField({
      name: 'gallery',
      title: 'Gallery',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'image',
          options: { hotspot: true },
          fields: [
            defineField({
              name: 'alt',
              title: 'Alt Text',
              type: 'string',
            }),
          ],
        }),
      ],
      description: 'Two or more images turn the project card into a swipeable carousel. One image renders as a plain frame. The first image is used as the project cover.',
    }),
    defineField({
      name: 'dataAdded',
      title: 'Date Added',
      type: 'date',
      options: { dateFormat: 'YYYY-MM-DD' },
    }),
  ],
  preview: {
    select: { title: 'title', media: 'gallery.0', subtitle: 'techStack' },
    prepare({ title, media, subtitle }) {
      return { title, media, subtitle: Array.isArray(subtitle) ? subtitle.join(', ') : '' }
    },
  },
})