import { readJson, removeKey, writeJson } from './storage.js'

const SESSION_KEY = 'adminSession'

// Dummy credentials for Phase 1. Later we’ll replace this with backend auth.
// Tip: You can change these anytime.
const ADMIN = {
  username: 'admin',
  password: 'admin123',
}

export function getSession() {
  return readJson(SESSION_KEY, null)
}

export function isLoggedIn() {
  return Boolean(getSession())
}

export function login({ username, password }) {
  const ok = username === ADMIN.username && password === ADMIN.password
  if (!ok) {
    return { ok: false, message: 'Invalid username or password.' }
  }

  const session = {
    username,
    loggedInAt: new Date().toISOString(),
  }
  writeJson(SESSION_KEY, session)
  return { ok: true, session }
}

export function logout() {
  removeKey(SESSION_KEY)
}

export function getAdminCredentialsHint() {
  // Used on the login screen to help beginners test quickly.
  return { username: ADMIN.username, password: ADMIN.password }
}

