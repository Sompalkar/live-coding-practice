'use client'

import { FormEvent, HtmlHTMLAttributes, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import useAuthStore from '@/store/page'
import axios from 'axios'

export default function TodoPage() {
 const { user, isAuthenticated, isLoading, logout } = useAuthStore()
  const router = useRouter()

  const [inputTodo, setInputTodo] = useState<string>('')
  const [todos, setTodos] = useState<string[]>([])
  const [loading, setLoading] = useState<boolean>(false)

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

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!inputTodo.trim()) return

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/todos/createTodo`,
        {
          data: inputTodo,
          userId: user?.data?.id,
        }
      )
      console.log(response.data)
      setTodos([...todos, inputTodo])
      setInputTodo('')
    } catch (error) {
      console.log(error)
    } finally {
    }
  }

 

  return (
    <div className="min-h-screen bg-gray-100 p-6 md:p-10">
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Todo App</h1>
          <p className="text-gray-600">Welcome back, {user?.data?.name}!</p>
        </div>
        <button
          onClick={handleLogout}
          className="px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow"
        >
          Logout
        </button>
      </div>

      {/* Add Todo */}
      <form
        onSubmit={handleSubmit}
        className="flex flex-col sm:flex-row gap-3 mb-6"
      >
        <input
          type="text"
          value={inputTodo}
          placeholder="Enter todo"
          onChange={(e) => setInputTodo(e.target.value)}
          className="flex-1 px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow"
        >
          {loading ? 'Adding todo...' : 'Add Todo'}
        </button>
      </form>

      {/* Todos List */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Your Todos</h2>
        {todos.length === 0 ? (
          <p className="text-gray-500">No todos yet. Start adding some!</p>
        ) : (
          <div className="space-y-3">
            {todos.map((todo) => (
              <div
                key={todo}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
              >
                <span className="text-gray-800">{todo}</span>
                <div className="flex gap-2">
                  <button className="px-3 py-1 text-sm bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition">
                    Edit
                  </button>
                  <button className="px-3 py-1 text-sm bg-red-500 text-white rounded-md hover:bg-red-600 transition">
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  </div>
  )
}