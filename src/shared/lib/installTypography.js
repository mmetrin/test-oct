import { typographText } from './typographText'

const TEXT_ATTRIBUTES = ['alt', 'title', 'placeholder', 'aria-label', 'aria-valuetext']
const SKIPPED_ANCESTORS = 'script, style, noscript, textarea, pre, code, svg, [contenteditable]'

function formatTextNode(node) {
  if (node.parentElement?.closest(SKIPPED_ANCESTORS)) return

  const formatted = typographText(node.nodeValue)
  if (formatted !== node.nodeValue) node.nodeValue = formatted
}

function formatAttributes(element) {
  if (element.closest(SKIPPED_ANCESTORS)) return

  for (const name of TEXT_ATTRIBUTES) {
    const value = element.getAttribute(name)
    if (value === null) continue

    const formatted = typographText(value)
    if (formatted !== value) element.setAttribute(name, formatted)
  }
}

function formatTree(root) {
  if (root.nodeType === Node.TEXT_NODE) {
    formatTextNode(root)
    return
  }
  if (root.nodeType !== Node.ELEMENT_NODE) return

  formatAttributes(root)
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT)
  while (walker.nextNode()) {
    if (walker.currentNode.nodeType === Node.TEXT_NODE) formatTextNode(walker.currentNode)
    else formatAttributes(walker.currentNode)
  }
}

function installTypography() {
  formatTree(document.body)

  const observer = new MutationObserver((records) => {
    // Наши собственные изменения текста не должны запускать следующий проход.
    observer.disconnect()
    for (const record of records) {
      if (record.type === 'characterData') formatTextNode(record.target)
      else if (record.type === 'attributes') formatAttributes(record.target)
      else for (const node of record.addedNodes) formatTree(node)
    }
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: TEXT_ATTRIBUTES,
      characterData: true,
      childList: true,
      subtree: true,
    })
  })

  observer.observe(document.body, {
    attributes: true,
    attributeFilter: TEXT_ATTRIBUTES,
    characterData: true,
    childList: true,
    subtree: true,
  })
}

if (document.body) installTypography()
else document.addEventListener('DOMContentLoaded', installTypography, { once: true })
