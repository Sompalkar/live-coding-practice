'use client'

import { FormEvent, HtmlHTMLAttributes, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import useAuthStore from '@/store/page'
import axios from 'axios'
import Todo from '@/components/todo'


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
  const [loading, setLoading] = useState<boolean>(false)

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
          {
            userId: user?.data._id,
          },
          { withCredentials: true }
        )
        setTodos(response.data.allTodos)
      } catch (error) {
        console.error('Error fetching todos:', error)
      } finally {
        setLoading(false)
      }
    }

    if (isAuthenticated) {
      getTodos()
    }


  }, [isAuthenticated, user?.data._id])





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
          userId: user?.data._id,
        },
        { withCredentials: true }
      )

      setTodos((prev) => [...prev, response.data.todo])
      setInputTodo('')
    } catch (error) {
      console.error('Error creating todo:', error)
    }
  }




   const handleClick = async (todoId: string) => {
    try {
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/todos/deleteTodo`,
        {
          data: { todoId }, 
          withCredentials: true,
        }
      )

      console.log('Delete response:', response.data)
      setTodos((prev) => prev.filter((t) => t._id !== todoId))
    } catch (error) {
      console.error('Error deleting todo:', error)
    }
  }
 

 

   
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Todo App</h1>
            <p className="text-gray-600">
              Welcome back, {user?.data.name || 'User'}!
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-sm"
          >
            Logout
          </button>
        </header>

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
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
          >
            {loading ? 'Adding...' : 'Add Todo'}
          </button>
        </form>

        {/* Todos List */}
        <section className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Your Todos</h2>
          {todos.length === 0 ? (
            <p className="text-gray-500">No todos yet. Start adding some!</p>
          ) : (
            <div className="space-y-3">
              {todos.map((todo) => (
                <Todo
                  key={todo._id}
                  title={todo.title}
                  completed={todo.completed}
                  _id={todo._id}
                  onClick={handleClick}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )



















}