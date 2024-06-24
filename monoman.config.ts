import path from 'node:path'
import { defineConfig } from 'monoman'

const docsLink = 'https://www.aira.com.tw/'
const githubRepo = 'airaTaiwan/vue-emap'
const githubLink: 'https://github.com/airaTaiwan/vue-emap' = `https://github.com/${githubRepo}`

let packageManager: string | undefined
let packageAuthor: string | undefined

function getPkgName(filePath: string) {
  const relative = path.relative(__dirname, filePath)
  const [, pkgName] = relative.split(path.sep)
  return pkgName
}

export default defineConfig([
  {
    include: ['packages/*/package.json'],
    type: 'json',
    contents(data: Record<string, unknown>, { filePath }) {
      const pkgName = getPkgName(filePath)

      const descriptions: Record<string, string> = {
        'playground': 'Vue EMap playground.',
        'core': 'Vue EMap core.',
        'vue-emap': 'Vue EMap component library.',
        'utils': 'Vue EMap utils library.',
      }

      if (!data.private) {
        data.description
          = descriptions[pkgName] || `${pkgName} feature from Vue EMap.`
        data.keywords = [
          'vue',
          'map',
          pkgName,
        ]
        data.license = 'MIT'
        data.homepage = docsLink
        data.bugs = { url: `${githubLink}/issues` }
        data.repository = {
          type: 'git',
          url: `git+${githubLink}.git`,
          directory: `packages/${pkgName}`,
        }
        data.files = ['dist']
        data.sideEffects = false
      }

      return data
    },
  },
  {
    include: ['package.json', 'packages/*/package.json', 'playground/package.json'],
    type: 'json',
    contents(data: Record<string, any>) {
      if (!packageManager) {
        packageManager = data.packageManager
      }
      else {
        data.packageManager = packageManager
      }

      if (!packageAuthor) {
        packageAuthor = data.author
      }
      else {
        data.author = packageAuthor
      }

      return data
    },
  },
])
