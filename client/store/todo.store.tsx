

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

 
type Todo = {
  title: string
  status: boolean
  userId: string
  todoId: string
}
 
type TodoState = {
 
  todos: Todo[]
   
  addTodos: (todo: Todo) => void
  removeTodos: (todoId: string) => void
  toggleTodoStatus: (todoId: string) => void
  
  getTodosByUser: (userId: string) => Todo[]
}
 
const todoStore = create<TodoState>()(
  persist(
    (set, get) => ({
     
      todos: [],
 
      addTodos: (todo: Todo) => {

        set((state) => ({

          todos: [...state.todos, todo]

        }))
      },
 
         removeTodos: (todoId: string) => {
          set((state) => ({
            todos: state.todos.filter(todo => todo.todoId !== todoId)
          }))
      },
 
      toggleTodoStatus: (todoId: string) => {

        set((state) => ({


          todos: state.todos.map(todo => 
            todo.todoId === todoId 
              ? { ...todo, status: !todo.status }
              : todo


          )

        }))
      },

       
    
      getTodosByUser: (userId: string) => {

        const state = get()

        return state.todos.filter(todo => todo.userId === userId)

      }
    }),
    {
      name: 'todo-storage', 
      
      version: 1  
    }
  )
)

export default todoStore
