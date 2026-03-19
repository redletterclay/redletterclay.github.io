'use client'

import { useEffect } from 'react'

// Snipcart v3 calls history.replaceState('') with a string, which crashes
// Next.js App Router's patched replaceState (it expects an object).
// This runs after hydration and wraps replaceState to coerce non-objects to {}.
export function SnipcartHistoryPatch() {
  useEffect(() => {
    const orig = history.replaceState.bind(history)
    history.replaceState = function (state: unknown, ...args: [string, string?]) {
      return orig(state !== null && typeof state === 'object' ? state : {}, ...args)
    }
  }, [])

  return null
}
