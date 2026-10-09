import { defineQuery } from 'groq'

export const PROJECTS_QUERY = defineQuery(
  `*[_type == "project" && defined(slug.current)] | order(dataAdded desc){
    _id,
    title,
    slug,
    techStack,
    githubUrl,
    dataAdded,
    gallery
  }`
)

export const PROJECT_QUERY = defineQuery(
  `*[_type == "project" && slug.current == $slug][0]{
    _id,
    title,
    slug,
    description,
    techStack,
    githubUrl,
    dataAdded,
    gallery
  }`
)

export const GLOBAL_SETTINGS_QUERY = defineQuery(
  `*[_type == "globalSettings"][0]{
    _id,
    siteName,
    siteDescription,
    hero,
    socialLinks,
    stackCategories,
    experience,
    contact
  }`
)