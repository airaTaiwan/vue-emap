import antfu from '@antfu/eslint-config'

export default antfu(
  {
    files: ['**/*.vue'],
    rules: {
      'import/first': 'off',
      'ts/consistent-type-definitions': 'off',
    },
  },
  {
    rules: {
      'import/order': 'off',
      'perfectionist/sort-array-includes': [
        'error',
        {
          'order': 'asc',
          'spread-last': true,
          'type': 'natural',
        },
      ],
      'perfectionist/sort-enums': [
        'error',
        {
          order: 'asc',
          type: 'natural',
        },
      ],
      'perfectionist/sort-exports': [
        'error',
        {
          order: 'asc',
          type: 'natural',
        },
      ],
      'perfectionist/sort-imports': [
        'error',
        {
          'custom-groups': {
            type: {
              react: 'react',
            },
            value: {
              nanostores: '@nanostores/**',
              react: ['react', 'react-*'],
            },
          },
          'groups': [
            'type',
            'react',
            'nanostores',
            ['builtin', 'external'],
            'internal-type',
            'internal',
            ['parent-type', 'sibling-type', 'index-type'],
            ['parent', 'sibling', 'index'],
            'side-effect',
            'style',
            'object',
            'unknown',
          ],
          'internal-pattern': [
            '@/components/**',
            '@/stores/**',
            '@/pages/**',
            '@/lib/**',
          ],
          'newlines-between': 'always',
          'order': 'asc',
          'type': 'natural',
        },
      ],
      'perfectionist/sort-interfaces': [
        'error',
        {
          order: 'asc',
          type: 'natural',
        },
      ],
      'perfectionist/sort-jsx-props': [
        'error',
        {
          groups: ['multiline', 'unknown', 'shorthand'],
          order: 'asc',
          type: 'natural',
        },
      ],
      'perfectionist/sort-maps': [
        'error',
        {
          order: 'asc',
          type: 'natural',
        },
      ],
      'perfectionist/sort-named-exports': [
        'error',
        {
          order: 'asc',
          type: 'natural',
        },
      ],
      'perfectionist/sort-named-imports': [
        'error',
        {
          order: 'asc',
          type: 'natural',
        },
      ],
      'perfectionist/sort-objects': [
        'error',
        {
          'custom-groups': {
            id: 'id',
          },
          'groups': ['id', 'unknown'],
          'order': 'asc',
          'partition-by-comment': 'Part:**',
          'type': 'natural',
        },
      ],
      'perfectionist/sort-svelte-attributes': [
        'error',
        {
          groups: ['multiline', 'unknown', ['shorthand', 'svelte-shorthand']],
          order: 'asc',
          type: 'natural',
        },
      ],
      'perfectionist/sort-union-types': [
        'error',
        {
          order: 'asc',
          type: 'natural',
        },
      ],
      'perfectionist/sort-vue-attributes': [
        'error',
        {
          groups: ['multiline', 'unknown', 'shorthand'],
          order: 'asc',
          type: 'natural',
        },
      ],
      'style/no-multiple-empty-lines': 'off',
      'vue/attributes-order': 'off',
    },
  },
)
