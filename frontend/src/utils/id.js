export function createId(prefix = 'id') {
  // Small, readable ID generator for localStorage records.
  // Later we can use MongoDB ObjectIds from the backend.
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`
}

