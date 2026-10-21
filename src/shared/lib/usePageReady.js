import { useEffect, useState } from 'react'

export function usePageReady(delay = 520) {
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    const readyTimer = window.setTimeout(() => {
      setIsReady(true)
    }, delay)

    return () => window.clearTimeout(readyTimer)
  }, [delay])

  return isReady
}
