'use client'

import { FormEvent, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import useAuthStore from '@/store/page'
import axios from 'axios'

type TodoType = {
  _id: string
  title: string
  completed: boolean
}

export default function TodoPage() {
  const { user, isAuthenticated, isLoading, logout } = useAuthStore()
  const router = useRouter()

  const [inputTodo, setInputTodo] = useState<string>('')
  const [todos, setTodos] = useState<TodoType[]>([])
  const [allTodos, setAllTodos] = useState<TodoType[]>([]) // master list
  const [loading, setLoading] = useState<boolean>(false)
  const [editingTodo, setEditingTodo] = useState<{ id: string; title: string } | null>(null)
  const [editInput, setEditInput] = useState<string>('')
  const [searchTodo, setSearchTodo] = useState<string>('')

  const handleLogout = async () => {
    await logout()
    router.push('/login')
  }

  useEffect(() => {
    const getTodos = async () => {
      try {
        setLoading(true)
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/todos/Alltodos`,
          { userId: user?._id },
          { withCredentials: true }
        )
        setTodos(response.data.data.todos)
        setAllTodos(response.data.data.todos) // keep master copy
      } catch (error) {
        console.error('Error fetching todos:', error)
      } finally {
        setLoading(false)
      }
    }

    if (isAuthenticated) {
      getTodos()
    }
  }, [isAuthenticated, user?._id])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-lg font-medium text-gray-700">Loading...</div>
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
          title: inputTodo,
          completed: false,
          userId: user?._id,
        },
        { withCredentials: true }
      )

      setTodos((prev) => [...prev, response.data.data.todo])
      setAllTodos((prev) => [...prev, response.data.data.todo]) // update master
      setInputTodo('')
    } catch (error) {
      console.error('Error creating todo:', error)
    }
  }

  const handleClick = async (todoId: string) => {
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/todos/deleteTodo`, {
        data: { todoId },
        withCredentials: true,
      })
      setTodos((prev) => prev.filter((t) => t._id !== todoId))
      setAllTodos((prev) => prev.filter((t) => t._id !== todoId)) // update master
    } catch (error) {
      console.error('Error deleting todo:', error)
    }
  }

  const handleEdit = (todoId: string, currentTitle: string) => {
    setEditingTodo({ id: todoId, title: currentTitle })
    setEditInput(currentTitle)
  }

  const handleEditSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!editingTodo || !editInput.trim()) return

    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/todos/editTodo`,
        { _id: editingTodo.id, title: editInput.trim(), userId: user?._id },
        { withCredentials: true }
      )

      setTodos((prev) =>
        prev.map((todo) =>
          todo._id === editingTodo.id ? { ...todo, title: editInput.trim() } : todo
        )
      )
      setAllTodos((prev) =>
        prev.map((todo) =>
          todo._id === editingTodo.id ? { ...todo, title: editInput.trim() } : todo
        )
      )
      setEditingTodo(null)
      setEditInput('')
    } catch (error) {
      console.error('Error updating todo:', error)
    }
  }

  const handleCancelEdit = () => {
    setEditingTodo(null)
    setEditInput('')
  }

  const handleToggleComplete = async (todoId: string, currentCompleted: boolean) => {
    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/todos/editTodo`,
        {
          _id: todoId,
          title: todos.find((t) => t._id === todoId)?.title,
          completed: !currentCompleted,
          userId: user?._id,
        },
        { withCredentials: true }
      )

      setTodos((prev) =>
        prev.map((todo) =>
          todo._id === todoId ? { ...todo, completed: !currentCompleted } : todo
        )
      )
      setAllTodos((prev) =>
        prev.map((todo) =>
          todo._id === todoId ? { ...todo, completed: !currentCompleted } : todo
        )
      )
    } catch (error) {
      console.error('Error toggling todo completion:', error)
    }
  }

  const handleSearchTodo = () => {
    if (!searchTodo.trim()) return
    const filtered = allTodos.filter((todo) =>
      todo.title.toLowerCase().includes(searchTodo.toLowerCase())
    )
    setTodos(filtered)
  }

  const handleClearSearch = () => {
    setTodos(allTodos) // restore from master
    setSearchTodo('')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Todo App</h1>
            <p className="text-gray-600 text-lg">
              Welcome back, {user?.name || 'User'}! 👋
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="px-6 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Logout
          </button>
        </header>

        {/* Add Todo */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Add New Todo</h2>
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={inputTodo}
              placeholder="What needs to be done?"
              onChange={(e) => setInputTodo(e.target.value)}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none text-lg"
            />
            <button
              type="submit"
              className="px-8 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
            >
              {loading ? 'Adding...' : 'Add Todo'}
            </button>
          </form>
        </div>

        {/* Search */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Search Todos</h2>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              placeholder="Search your todo"
              value={searchTodo}
              onChange={(e) => setSearchTodo(e.target.value)}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none text-lg"
            />
            <button
              onClick={handleSearchTodo}
              className="px-8 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
            >
              Search
            </button>
            <button
              onClick={handleClearSearch}
              className="px-8 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Edit Todo Modal */}
        {editingTodo && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Edit Todo</h3>
              <form onSubmit={handleEditSubmit} className="space-y-4">
                <input
                  type="text"
                  value={editInput}
                  onChange={(e) => setEditInput(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                  autoFocus
                />
                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-xl hover:bg-gray-400 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Todos List */}
        <section className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">Your Todos</h2>
            <div className="text-sm text-gray-500">
              {todos.filter((t) => t.completed).length} of {todos.length} completed
            </div>
          </div>

          {todos.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📝</div>
              <p className="text-gray-500 text-lg">No todos yet. Start adding some!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {todos.map((todo) => (
                <div key={todo._id} className="group">
                  <div
                    className={`flex items-center justify-between rounded-xl border p-4 shadow-sm hover:shadow-md transition-all duration-200 ${
                      todo.completed
                        ? 'bg-green-50 border-green-200'
                        : 'bg-white border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <button
                        onClick={() => handleToggleComplete(todo._id, todo.completed)}
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                          todo.completed
                            ? 'bg-green-500 border-green-500'
                            : 'border-gray-300 hover:border-green-400'
                        }`}
                      >
                        {todo.completed && (
                          <svg
                            className="w-3 h-3 text-white"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </button>
                      <h1
                        className={`text-lg font-medium flex-1 ${
                          todo.completed ? 'line-through text-gray-500' : 'text-gray-900'
                        }`}
                      >
                        {todo.title}
                      </h1>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(todo._id, todo.title)}
                        className="px-3 py-1.5 rounded-lg border border-blue-300 text-blue-600 text-sm hover:bg-blue-50 hover:border-blue-400 transition-colors shadow-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleClick(todo._id)}
                        className="px-3 py-1.5 rounded-lg bg-red-500 text-white text-sm hover:bg-red-600 transition-colors shadow-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
