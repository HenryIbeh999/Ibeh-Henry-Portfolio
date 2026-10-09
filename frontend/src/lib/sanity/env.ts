// Browser-safe, publishable values only.
// Never read secrets here — this module is bundled into the client.
export const projectId = import.meta.env.VITE_SANITY_PROJECT_ID!
export const dataset = import.meta.env.VITE_SANITY_DATASET!
export const apiVersion = import.meta.env.VITE_SANITY_API_VERSION ?? '2026-02-01'

// Where the Studio lives. Used for the Presentation-tool link only.
export const studioUrl = import.meta.env.VITE_SANITY_STUDIO_URL

// Opt-in preview mode. Deliberately off by default so production builds never
// receive Stega markers or draft content. Enable with:
//   VITE_SANITY_PREVIEW_MODE=true npm run dev
export const previewMode = import.meta.env.VITE_SANITY_PREVIEW_MODE === 'true'