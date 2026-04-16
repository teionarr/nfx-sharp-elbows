import { useState, useEffect } from 'react'
import { loadPersonas } from '../services/personaLoader.js'

export function usePersonas() {
  const [personas, setPersonas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    loadPersonas()
      .then(data => {
        if (!cancelled) {
          setPersonas(data)
          setLoading(false)
        }
      })
      .catch(err => {
        if (!cancelled) {
          setError(err.message)
          setLoading(false)
        }
      })
    return () => { cancelled = true }
  }, [])

  return { personas, loading, error }
}
