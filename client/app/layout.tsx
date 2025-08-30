'use client'

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import AuthProvider from './components/AuthProvider'
import useAuthStore from '@/store/page'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

const inter = Inter({ subsets: ['latin'] })
 
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {



  const { user, isAuthenticated, isLoading, logout, fetchCurrentUser } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    // Check if user is authenticated on component mount
    if (!isAuthenticated) {
      fetchCurrentUser()
    }
  }, [isAuthenticated, fetchCurrentUser])
 

  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
