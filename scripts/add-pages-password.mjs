import { readFile, readdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const distDirectory = fileURLToPath(new URL('../dist/', import.meta.url))
const passwordHash = '083c4cd5ba7679889fb7ec86d73be7d7c2ab3bb4ec454d9d1fc57e00c2de4538'

const gateHead = `
<style>
  html:not([data-mts-auth="ok"]),
  html:not([data-mts-auth="ok"]) body { overflow: hidden !important; }
  html:not([data-mts-auth="ok"]) #root { visibility: hidden !important; }
  html[data-mts-auth="ok"] #mts-access { display: none; }
  #mts-access { position: fixed; inset: 0; z-index: 2147483647; display: grid; place-items: center; padding: 24px; background: #f6f7fb; font-family: Arial, sans-serif; }
  #mts-access form { width: min(100%, 380px); padding: 40px; border: 1px solid #e8e9ef; border-radius: 24px; background: #fff; box-shadow: 0 22px 70px #1d1d3514; }
  #mts-access h1 { margin: 0 0 10px; color: #1a1a1f; font-size: 30px; line-height: 1.15; }
  #mts-access p { margin: 0 0 28px; color: #666977; font-size: 15px; line-height: 1.5; }
  #mts-access label { display: block; margin-bottom: 8px; color: #373944; font-size: 14px; font-weight: 600; }
  #mts-access input { box-sizing: border-box; width: 100%; height: 48px; padding: 0 14px; border: 1px solid #cfd1da; border-radius: 10px; background: #fff; color: #1a1a1f; font: inherit; }
  #mts-access input:focus { border-color: #e30613; outline: 2px solid #e3061333; }
  #mts-access button { width: 100%; height: 48px; margin-top: 16px; border: 0; border-radius: 10px; background: #e30613; color: #fff; font: inherit; font-weight: 700; cursor: pointer; }
  #mts-access button:disabled { cursor: wait; opacity: .7; }
  #mts-access-error { min-height: 21px; margin: 12px 0 0 !important; color: #c4000b !important; font-size: 13px !important; }
</style>
<script>
  try { if (sessionStorage.getItem('test-oct-access') === 'ok') document.documentElement.dataset.mtsAuth = 'ok' } catch {}
</script>`

const gateBody = `
<div id="mts-access" role="dialog" aria-modal="true" aria-labelledby="mts-access-title">
  <form id="mts-access-form">
    <h1 id="mts-access-title">МТС Ads</h1>
    <p>Введите пароль для просмотра сайта.</p>
    <label for="mts-access-password">Пароль</label>
    <input id="mts-access-password" type="password" autocomplete="current-password" required>
    <button type="submit">Открыть сайт</button>
    <p id="mts-access-error" role="alert" aria-live="polite"></p>
  </form>
</div>
<script>
  (() => {
    const form = document.getElementById('mts-access-form')
    const input = document.getElementById('mts-access-password')
    const error = document.getElementById('mts-access-error')
    const button = form.querySelector('button')
    if (document.documentElement.dataset.mtsAuth !== 'ok') input.focus()

    form.addEventListener('submit', async (event) => {
      event.preventDefault()
      button.disabled = true
      error.textContent = ''
      try {
        const bytes = new TextEncoder().encode(input.value)
        const digest = await crypto.subtle.digest('SHA-256', bytes)
        const actual = Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('')
        if (actual === '${passwordHash}') {
          try { sessionStorage.setItem('test-oct-access', 'ok') } catch {}
          document.documentElement.dataset.mtsAuth = 'ok'
          input.value = ''
        } else {
          error.textContent = 'Неверный пароль'
          input.select()
        }
      } catch {
        error.textContent = 'Не удалось проверить пароль. Обновите страницу.'
      } finally {
        button.disabled = false
      }
    })
  })()
</script>`

async function htmlFiles(directory) {
  const result = []
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name)
    if (entry.isDirectory()) result.push(...await htmlFiles(path))
    else if (entry.name.endsWith('.html')) result.push(path)
  }
  return result
}

const pages = await htmlFiles(distDirectory)
if (pages.length === 0) throw new Error('No HTML pages found in dist')

for (const page of pages) {
  let html = await readFile(page, 'utf8')
  if (!html.includes('</head>') || !html.includes('<body>')) throw new Error(`Unexpected HTML: ${page}`)
  html = html.replace('</head>', `${gateHead}\n</head>`)
  html = html.replace('<body>', `<body>${gateBody}`)
  await writeFile(page, html)
}

console.log(`Added password screen to ${pages.length} pages`)
