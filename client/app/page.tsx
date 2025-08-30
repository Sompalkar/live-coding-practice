'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import useAuthStore from '@/store/page'

export default function HomePage() {
  const { isAuthenticated, isLoading, user } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    // Redirect authenticated users to todo page
    if (isAuthenticated && !isLoading) {
      router.push('/todo')
    }
  }, [isAuthenticated, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    )
  }

  if (isAuthenticated) {
    return null // Will redirect to todo
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full text-center space-y-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to Todo App</h1>
          <p className="text-gray-600 mb-8">
            A simple and efficient way to manage your tasks
          </p>
        </div>
        
        <div className="space-y-4">
          <Link
            href="/login"
            className="block w-full bg-indigo-600 text-white py-3 px-4 rounded-md hover:bg-indigo-700 transition-colors"
          >
            Sign In
          </Link>
          
          <Link
            href="/register"
            className="block w-full bg-white text-indigo-600 py-3 px-4 border border-indigo-600 rounded-md hover:bg-gray-50 transition-colors"
          >
            Create Account
          </Link>
        </div>
      </div>
    </div>
  )
}