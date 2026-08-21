import { copyFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'

const outputDirectory = resolve(import.meta.dirname, '..', 'dist')
const portfolioEntry = resolve(outputDirectory, 'masonry.html')

await Promise.all([
  copyFile(portfolioEntry, resolve(outputDirectory, 'index.html')),
  copyFile(portfolioEntry, resolve(outputDirectory, '404.html')),
  writeFile(resolve(outputDirectory, '.nojekyll'), ''),
])

