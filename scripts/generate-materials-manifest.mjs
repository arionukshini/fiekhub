import { readdir, stat, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const sourceRoot = path.join(
  projectRoot,
  'public',
  'materials',
  'fiek',
  'viti1',
  'Fizik1',
)
const outputPath = path.join(
  projectRoot,
  'public',
  'materials',
  'fiek',
  'viti1',
  'fizika-1-manifest.json',
)

const collator = new Intl.Collator('sq', {
  numeric: true,
  sensitivity: 'base',
})

async function readDirectory(directory, relativePath = '') {
  const entries = await readdir(directory, { withFileTypes: true })
  const nodes = await Promise.all(
    entries
      .filter(
        (entry) =>
          ![
            'desktop.ini',
            'temat-e-testeve.json',
          ].includes(entry.name.toLowerCase()),
      )
      .map(async (entry) => {
        const entryPath = path.join(directory, entry.name)
        const entryRelativePath = path
          .join(relativePath, entry.name)
          .split(path.sep)
          .join('/')

        if (entry.isDirectory()) {
          const children = await readDirectory(entryPath, entryRelativePath)
          return {
            type: 'folder',
            name: entry.name,
            path: entryRelativePath,
            children,
          }
        }

        const fileStats = await stat(entryPath)
        return {
          type: 'file',
          name: entry.name,
          path: entryRelativePath,
          extension: path.extname(entry.name).slice(1).toLowerCase(),
          size: fileStats.size,
        }
      }),
  )

  return nodes.sort((left, right) => {
    if (left.type !== right.type) return left.type === 'folder' ? -1 : 1
    return collator.compare(left.name, right.name)
  })
}

const children = await readDirectory(sourceRoot)
const manifest = {
  subject: 'Fizika 1',
  root: 'materials/fiek/viti1/Fizik1',
  children,
}

await writeFile(outputPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8')
console.log(`Generated ${path.relative(projectRoot, outputPath)}`)
