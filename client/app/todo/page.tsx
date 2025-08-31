'use client'

import { FormEvent, HtmlHTMLAttributes, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import useAuthStore from '@/store/page'
import axios from 'axios'

export default function TodoPage() {
  const { user, isAuthenticated, isLoading, logout, fetchCurrentUser } = useAuthStore()
  const router = useRouter()

  const [inputTodo, setInputTodo]=useState<string>('')
  const [todos, setTodos]= useState<string[]>([])
const [ loading, setLoading]= useState<boolean>(false);


  

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


  const handleSubmit= async (e:FormEvent<HTMLFormElement>)=>{

      e.preventDefault()
     
      if (!inputTodo.trim()) return
       
          try { 
            
                  const response= await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/todo/createTodo`,{
                      data:inputTodo
            
                  })
                  console.log(response)


          } catch (error) {
                        
             console.log(error)
             
            }finally{ 
            }


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

        <div>


          <form onSubmit={handleSubmit}>


            <input type='text' value={inputTodo} placeholder='enter todo' onChange={(e)=> setInputTodo(e.target.value)} />
            <button type='submit'> {loading ? "Adding todo ... " : "Add Todo"} </button>
          </form>
        </div>
      </div>
    </div>
  )
}