import { useEffect, useMemo, useState } from 'react'
import { AuthContext } from './AuthContextValue.js'
import { hasSupabaseConfig, supabase } from '../lib/supabaseClient.js'

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(hasSupabaseConfig)

  useEffect(() => {
    if (!hasSupabaseConfig) {
      return undefined
    }

    let active = true

    supabase.auth.getSession().then(({ data }) => {
      if (active) {
        setSession(data.session)
        setLoading(false)
      }
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession)
      setLoading(false)
    })

    return () => {
      active = false
      subscription.unsubscribe()
    }
  }, [])

  async function signOut() {
    if (!supabase) return
    await supabase.auth.signOut()
  }

  const value = useMemo(
    () => ({
      hasSupabaseConfig,
      loading,
      session,
      signOut,
      user: session?.user ?? null,
    }),
    [loading, session],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
