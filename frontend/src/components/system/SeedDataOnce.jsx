import { useEffect } from 'react'
import { seedIfNeeded } from '../../services/seed.js'

export function SeedDataOnce() {
  useEffect(() => {
    seedIfNeeded()
  }, [])

  return null
}

