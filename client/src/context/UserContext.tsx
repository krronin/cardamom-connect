import React, { createContext, useCallback, useState } from 'react'

export interface User {
  id: string
  username: string
  email: string
}

export interface UserContextType {
  user: User | null
  token: string | null
  loading: boolean
  login: (user: User, token: string) => void
  logout: () => void
  updateUser: (user: User) => void
  isAuthenticated: boolean
}

export const UserContext = createContext<UserContextType | undefined>(undefined)

interface UserProviderProps {
  children: React.ReactNode
}

export function UserProvider({ children }: UserProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading] = useState(true)

  const login = useCallback((newUser: User, newToken: string) => {
    setUser(newUser)
    setToken(newToken)
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    setToken(null)
  }, [])

  const updateUser = useCallback((updatedUser: User) => {
    setUser(updatedUser)
  }, [])

  const value: UserContextType = {
    user,
    token,
    loading,
    login,
    logout,
    updateUser,
    isAuthenticated: !!user && !!token,
  }

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}