"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

type User = {
  id: string
  email: string
  name: string
  role: "user" | "admin"
}

type AuthContextType = {
  user: User | null
  login: (email: string, password: string) => Promise<{ success: boolean; user?: User }>
  logout: () => void
  isAuthenticated: boolean
  isAdmin: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("user")
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
  }, [])

  const login = async (email: string, password: string): Promise<{ success: boolean; user?: User }> => {
    // Mock authentication - in production, this would call an API
    if (email === "admin@atelier.com" && password === "admin123") {
      const adminUser = { id: "1", email, name: "Admin User", role: "admin" as const }
      setUser(adminUser)
      localStorage.setItem("user", JSON.stringify(adminUser))
      return { success: true, user: adminUser }
    } else if (email === "user@example.com" && password === "user123") {
      const regularUser = { id: "2", email, name: "John Doe", role: "user" as const }
      setUser(regularUser)
      localStorage.setItem("user", JSON.stringify(regularUser))
      return { success: true, user: regularUser }
    }
    return { success: false }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
        isAdmin: user?.role === "admin",
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
