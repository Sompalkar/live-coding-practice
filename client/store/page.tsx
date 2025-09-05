import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { UserResponse } from '@/types/user'
import axios from 'axios'
 
interface UserState {
 
  user: UserResponse | null
   
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  
  
  setUser: (user: UserResponse) => void
  clearUser: () => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
   
  login: (email: string, password: string) => Promise<boolean>
  register: (email: string, password: string, name: string) => Promise<boolean>
  logout: () => Promise<void>
  fetchCurrentUser: () => Promise<void>
}
 
const useAuthStore = create<UserState>()(
  persist(
    (set, get) => ({
      
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

   
      setUser: (user) => set({ user, isAuthenticated: true, error: null }),
      clearUser: () => set({ user: null, isAuthenticated: false, error: null }),
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),
 
      login: async (email: string, password: string) => {
        try {
          set({ isLoading: true, error: null })
          
          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/login`,
            { email, password },
            { withCredentials: true }
          )
          
          const userData = response.data.data
          set({ user: userData, isAuthenticated: true, isLoading: false })
          return true
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || 'Login failed'
          set({ error: errorMessage, isLoading: false })
          return false
        }
      },
    

      register: async (email: string, password: string, name: string) => {
        try {
          set({ isLoading: true, error: null })
          
          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/register`,
            { email, password, name },
            { withCredentials: true }
          )
          
          const userData = response.data.data
          set({ user: userData, isAuthenticated: true, isLoading: false })
          return true
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || 'Registration failed'
          set({ error: errorMessage, isLoading: false })
          return false
        }
      },

 
      logout: async () => {
        try {
          await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/logout`,
            {},
            { withCredentials: true }
          )
        } catch (error) {
          console.error('Logout error:', error)
        } finally {
          set({ user: null, isAuthenticated: false, error: null })
        }
      },
 
      fetchCurrentUser: async () => {
        try {
          set({ isLoading: true, error: null })
          
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/me`,
            { withCredentials: true }
          )
          
          const userData = response.data.data
          set({ user: userData, isAuthenticated: true, isLoading: false })

        } catch (error: any) { 
          set({ user: null, isAuthenticated: false, isLoading: false })
        }
      },
    }),
    {
      name: 'auth-storage',  
      partialize: (state) => ({ 
        user: state.user, 
        isAuthenticated: state.isAuthenticated 
      }),  
    }
  )
)





export default useAuthStore
