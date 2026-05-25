import { readFile, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const distDir = resolve(rootDir, 'dist')
const indexPath = resolve(distDir, 'index.html')

let html = await readFile(indexPath, 'utf8')

const stylesheetMatch = html.match(/<link rel="stylesheet" crossorigin href="(.+?)">/)
if (stylesheetMatch) {
  const cssPath = resolve(distDir, stylesheetMatch[1])
  const css = await readFile(cssPath, 'utf8')
  html = html.replace(stylesheetMatch[0], () => `<style>\n${css}\n</style>`)
}

const scriptMatch = html.match(/<script type="module" crossorigin src="(.+?)"><\/script>/)
if (scriptMatch) {
  const jsPath = resolve(distDir, scriptMatch[1])
  const js = await readFile(jsPath, 'utf8')
  const safeJs = js.replaceAll('</script', '<\\/script')
  html = html.replace(scriptMatch[0], () => '')
  html = html.replace('</body>', () => `    <script>\n${safeJs}\n</script>\n  </body>`)
}

await writeFile(indexPath, html)
