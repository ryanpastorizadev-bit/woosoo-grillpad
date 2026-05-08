import antfu from '@antfu/eslint-config'

export default antfu({
  vue: true,
  typescript: true,
  stylistic: { semi: false, quotes: 'single' },
  ignores: [
    '.agents/**',
    '.nuxt/**',
    '.output/**',
    'dist/**',
    'node_modules/**',
  ],
})
