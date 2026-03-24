function parseYmd(ymd) {
  // Interpret YYYY-MM-DD as local date.
  const [y, m, d] = ymd.split('-').map(Number)
  return new Date(y, m - 1, d)
}

function toYmd(d) {
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

export function clampDateRange(startYmd, endYmd) {
  if (!startYmd || !endYmd) return { startYmd, endYmd }
  if (startYmd <= endYmd) return { startYmd, endYmd }
  return { startYmd: endYmd, endYmd: startYmd }
}

export function listDatesInclusive(startYmd, endYmd) {
  if (!startYmd || !endYmd) return []
  const { startYmd: s, endYmd: e } = clampDateRange(startYmd, endYmd)

  const start = parseYmd(s)
  const end = parseYmd(e)
  const dates = []
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    dates.push(toYmd(d))
  }
  return dates
}

