import antfu from '@antfu/eslint-config'

export default antfu({
  vue: true,
  typescript: true,
  stylistic: { semi: false, quotes: 'single' },
  ignores: ['.nuxt', '.output', 'node_modules']
})
