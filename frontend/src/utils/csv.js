function escapeCell(value) {
  const s = String(value ?? '')
  // Escape quotes by doubling them, wrap if contains comma/newline/quote.
  const needsWrap = /[,"\n\r]/.test(s)
  const escaped = s.replace(/"/g, '""')
  return needsWrap ? `"${escaped}"` : escaped
}

export function toCsv(rows) {
  return rows.map((r) => r.map(escapeCell).join(',')).join('\n')
}

export function downloadTextFile(filename, text, mime = 'text/plain') {
  const blob = new Blob([text], { type: `${mime};charset=utf-8` })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

