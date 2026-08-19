export function exportSvg(svg: SVGSVGElement, title: string): void {
  const clone = svg.cloneNode(true) as SVGSVGElement
  clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg'); clone.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink')
  const embeddedStyles = document.createElementNS('http://www.w3.org/2000/svg', 'style')
  embeddedStyles.textContent = `text { fill: inherit; } .svg-title { font: 700 15px Manrope, sans-serif; letter-spacing: -0.02em; } .svg-subtitle { font: 10px monospace; letter-spacing: 0.04em; opacity: 0.7; } .svg-label { font: 600 12px Manrope, sans-serif; } .svg-percent { font: 500 11px monospace; opacity: 0.75; } .svg-total { font: 10px monospace; }`
  clone.insertBefore(embeddedStyles, clone.firstChild)
  const source = new XMLSerializer().serializeToString(clone); const blob = new Blob([`<?xml version="1.0" encoding="UTF-8"?>\n${source}`], { type: 'image/svg+xml' }); const url = URL.createObjectURL(blob); const link = document.createElement('a')
  link.href = url; link.download = `${(title || 'technical-capabilities').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'technical-capabilities'}-capabilities.svg`; link.click(); URL.revokeObjectURL(url)
}