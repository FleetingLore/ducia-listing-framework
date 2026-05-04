import { useState, useEffect } from 'react'

export function useAdmin() {
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkSession = async () => {
      const token = sessionStorage.getItem('session_token')
      if (!token) {
        setLoading(false)
        window.__isAdmin = false
        return
      }
      
      try {
        const res = await fetch('/api/admin/session', {
          headers: { 'X-Session-Token': token }
        })
        const data = await res.json()
        const admin = data.isAdmin === true
        setIsAdmin(admin)
        window.__isAdmin = admin
      } catch (err) {
        console.error('检查 session 失败:', err)
        window.__isAdmin = false
      }
      setLoading(false)
    }
    
    checkSession()
  }, [])

  const createSession = async (token) => {
    sessionStorage.setItem('session_token', token)
    setIsAdmin(true)
    window.__isAdmin = true
  }

  const destroySession = async () => {
    const token = sessionStorage.getItem('session_token')
    if (token) {
      await fetch('/api/admin/session', {
        method: 'DELETE',
        headers: { 'X-Session-Token': token }
      })
      sessionStorage.removeItem('session_token')
    }
    setIsAdmin(false)
    window.__isAdmin = false
  }

  return { isAdmin, loading, createSession, destroySession }
}
