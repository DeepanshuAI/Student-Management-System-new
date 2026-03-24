const PREFIX = 'sms_v1'

function key(k) {
  return `${PREFIX}:${k}`
}

export function readJson(k, fallback) {
  try {
    const raw = localStorage.getItem(key(k))
    if (!raw) return fallback
    return JSON.parse(raw)
  } catch {
    return fallback
  }
}

export function writeJson(k, value) {
  localStorage.setItem(key(k), JSON.stringify(value))
}

export function removeKey(k) {
  localStorage.removeItem(key(k))
}

