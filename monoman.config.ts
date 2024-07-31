import { defineConfig } from 'monoman'
import path from 'node:path'

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
    contents(data: Record<string, unknown>, { filePath }) {
      const pkgName = getPkgName(filePath)

      const descriptions: Record<string, string> = {
        'core': 'Vue EMap core.',
        'playground': 'Vue EMap playground.',
        'utils': 'Vue EMap utils library.',
        'vue-emap': 'Vue EMap component library.',
      }

      if (!data.private) {
        data.name = `@airataiwan/${pkgName.toLocaleLowerCase()}`
        data.description
          = descriptions[pkgName] || `${pkgName} feature from Vue EMap.`
        data.keywords = [
          'vue',
          'map',
          pkgName,
        ]
        data.publishConfig = {
          registry: 'https://npm.pkg.github.com/',
        }
        data.license = 'MIT'
        data.homepage = docsLink
        data.bugs = { url: `${githubLink}/issues` }
        data.repository = {
          directory: `packages/${pkgName}`,
          type: 'git',
          url: `git+${githubLink}.git`,
        }
        data.files = ['dist']
        data.sideEffects = false
      }

      return data
    },
    include: ['packages/*/package.json'],
    type: 'json',
  },
  {
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
    include: ['package.json', 'packages/*/package.json', 'playground/package.json'],
    type: 'json',
  },
])
