import { readdirSync, readFileSync, statSync } from 'node:fs'
import { extname, join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const sourceRoot = fileURLToPath(new URL('../src', import.meta.url))
const extensions = new Set(['.js', '.jsx', '.ts', '.tsx'])
const violations = []

function walk(directory) {
  for (const entry of readdirSync(directory)) {
    const filePath = join(directory, entry)
    const stats = statSync(filePath)

    if (stats.isDirectory()) {
      walk(filePath)
      continue
    }

    if (!extensions.has(extname(filePath))) {
      continue
    }

    const content = readFileSync(filePath, 'utf8')
    const lines = content.split(/\r?\n/)

    lines.forEach((line, index) => {
      if (/\bexport\s+default\b/.test(line)) {
        violations.push(`${relative(process.cwd(), filePath)}:${index + 1}`)
      }
    })
  }
}

walk(sourceRoot)

if (violations.length > 0) {
  console.error('Default exports are forbidden:')
  violations.forEach((violation) => console.error(`- ${violation}`))
  process.exitCode = 1
}
