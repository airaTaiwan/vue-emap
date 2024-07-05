import antfu from '@antfu/eslint-config'

export default antfu(
  {
    files: ['**/*.vue'],
    rules: {
      'import/first': 'off',
      'ts/consistent-type-definitions': 'off',
    },
  },
)
