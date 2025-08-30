'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import useAuthStore from '@/store/page'

export default function TodoPage() {
  const { user, isAuthenticated, isLoading, logout, fetchCurrentUser } = useAuthStore()
  const router = useRouter()

  

  const handleLogout = async () => {
    await logout()
    router.push('/login')
  }
 
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    )
  }
 

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Todo App</h1>
            <p className="text-gray-600">Welcome back, {user?.data?.name}!</p>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Logout
          </button>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Your Todos</h2>
          <p className="text-gray-500">Todo functionality will be implemented here...</p>
        </div>
      </div>
    </div>
  )
}