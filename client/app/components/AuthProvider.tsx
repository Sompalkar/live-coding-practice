'use client'

import { useEffect } from 'react'
import useAuthStore from '@/store/page'

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const { fetchCurrentUser } = useAuthStore()

  useEffect(() => {
    // Check authentication status when app loads
    fetchCurrentUser()
  }, [fetchCurrentUser])

  return <>{children}</>
}
