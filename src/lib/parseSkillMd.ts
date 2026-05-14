export interface SkillRequirements {
  env?: string[]
  bins?: string[]
  os?: string
}

export interface SkillFrontmatter {
  name?: string
  description?: string
  version?: string
  requires?: SkillRequirements
}

export interface ParsedSkillMd {
  frontmatter: SkillFrontmatter
  body: string
}

export function parseSkillMd(raw: string): ParsedSkillMd {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/)
  if (!match) return { frontmatter: {}, body: raw }

  const [, yamlBlock, body] = match
  const frontmatter: SkillFrontmatter = {}

  // Simple line-by-line YAML parser for the flat + nested fields we need
  const lines = yamlBlock.split(/\r?\n/)
  let i = 0

  while (i < lines.length) {
    const line = lines[i]
    const topMatch = line.match(/^(\w[\w-]*):\s*(.*)$/)
    if (!topMatch) { i++; continue }

    const [, key, val] = topMatch

    if (key === 'requires') {
      const req: SkillRequirements = {}
      i++
      while (i < lines.length && lines[i].startsWith('  ')) {
        const subLine = lines[i].trimStart()
        const subMatch = subLine.match(/^(\w+):\s*(.*)$/)
        if (subMatch) {
          const [, subKey, subVal] = subMatch
          if (subKey === 'env' || subKey === 'bins') {
            const items: string[] = []
            i++
            while (i < lines.length && lines[i].match(/^\s{4}- /)) {
              items.push(lines[i].replace(/^\s{4}- /, '').trim())
              i++
            }
            req[subKey] = items
          } else if (subKey === 'os') {
            req.os = subVal.trim()
            i++
          } else {
            i++
          }
        } else {
          i++
        }
      }
      frontmatter.requires = req
    } else {
      const stripped = val.replace(/^["']|["']$/g, '').trim()
      if (key === 'name') frontmatter.name = stripped
      else if (key === 'description') frontmatter.description = stripped
      else if (key === 'version') frontmatter.version = stripped
      i++
    }
  }

  return { frontmatter, body: body.trim() }
}
