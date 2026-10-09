import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: 'zmh5gtp5',
    dataset: 'production'
  },
  typegen: {
    enabled: true,
    path: '../frontend/src/**/*.{ts,tsx}',
    schema: 'schema.json',
    generates: '../frontend/src/sanity.types.ts',
    overloadClientMethods: true,
  },
  deployment: {
    /**
     * Enable auto-updates for studios.
     * Learn more at https://www.sanity.io/docs/studio/latest-version-of-sanity#k47faf43faf56
     */
    autoUpdates: true,
    appId: 'qp6b5p5qgykeupddi1yi775m'
  },
})
