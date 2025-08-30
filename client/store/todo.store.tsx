

import { create } from 'zustand'
import { persist } from 'zustand/middleware'





type Todo ={

      title:string,
      status:boolean,
      userId:string,
      todoId:string
}


 type TodoState ={

      todos: Todo [],

      addTodos:(todo:Todo)=>void 
      removeTodos:(todo:Todo)=>void
      toggleTodoStatus: (todo:Todo)=> void


 }

const todoStore= create<TodoState>()(
 
  persist(
    (set, get )=>({
        todos: [],



          addTodos:(todo)=>
            set((state) => ({
                todos: [...state.todos, todo],
              })),


              toggleTodoStatus:(todo)=>
                set((state)=>({}))
       })


  )
  

)
