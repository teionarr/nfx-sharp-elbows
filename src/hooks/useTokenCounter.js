import { useRef, useState, useCallback } from 'react'

export function useTokenCounter() {
  const totalRef = useRef(0)
  const [displayTotal, setDisplayTotal] = useState(0)

  const addTokens = useCallback(count => {
    if (typeof count !== 'number' || isNaN(count)) return
    totalRef.current += count
    setDisplayTotal(totalRef.current)
  }, [])

  const resetTokens = useCallback(() => {
    totalRef.current = 0
    setDisplayTotal(0)
  }, [])

  return { totalTokens: displayTotal, addTokens, resetTokens }
}
