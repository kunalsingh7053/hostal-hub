import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import api from '../api/axios'

const AuthContext = createContext(null)

const STORAGE_KEYS = {
  token: 'hostelHubToken',
  user: 'hostelHubUser',
  role: 'hostelHubRole',
}

const AUTH_ENDPOINTS = {
  student: {
    login: '/student/auth/login',
    register: '/student/auth/register',
    profileKey: 'student',
  },
  warden: {
    login: '/warden/auth/login',
    register: '/warden/auth/register',
    profileKey: 'warden',
  },
  admin: {
    login: '/admin/login',
    register: '/admin/register',
    profileKey: 'admin',
  },
}

const getStorage = () => (typeof window !== 'undefined' ? window.localStorage : null)

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => getStorage()?.getItem(STORAGE_KEYS.token))
  const [user, setUser] = useState(() => {
    const raw = getStorage()?.getItem(STORAGE_KEYS.user)
    if (!raw) return null
    try {
      return JSON.parse(raw)
    } catch (error) {
      return null
    }
  })
  const [role, setRole] = useState(() => getStorage()?.getItem(STORAGE_KEYS.role))
  const [authLoading, setAuthLoading] = useState(false)
  const [initializing, setInitializing] = useState(true)

  useEffect(() => {
    setInitializing(false)
  }, [])

  const persist = useCallback((nextToken, nextUser, nextRole) => {
    const storage = getStorage()
    if (!storage) return

    if (nextToken) {
      storage.setItem(STORAGE_KEYS.token, nextToken)
    } else {
      storage.removeItem(STORAGE_KEYS.token)
    }

    if (nextUser) {
      storage.setItem(STORAGE_KEYS.user, JSON.stringify(nextUser))
    } else {
      storage.removeItem(STORAGE_KEYS.user)
    }

    if (nextRole) {
      storage.setItem(STORAGE_KEYS.role, nextRole)
    } else {
      storage.removeItem(STORAGE_KEYS.role)
    }
  }, [])

  const login = useCallback(async ({ email, password, selectedRole, role: explicitRole }) => {
    const resolvedRole = selectedRole || explicitRole
    const endpoint = AUTH_ENDPOINTS[resolvedRole]?.login
    if (!endpoint) {
      throw new Error('Unsupported role selected')
    }

    setAuthLoading(true)
    try {
      const { data } = await api.post(endpoint, { email, password })
      const accessToken = data?.token || data?.accessToken || data?.jwt
      const profileKey = AUTH_ENDPOINTS[resolvedRole]?.profileKey
      const profile =
        (profileKey ? data?.[profileKey] : null) ||
        data?.user ||
        data?.data ||
        data?.profile ||
        null

      if (!accessToken) {
        throw new Error('Token missing in login response')
      }

      setToken(accessToken)
      setUser(profile)
      setRole(resolvedRole)
      persist(accessToken, profile, resolvedRole)

      return { role: resolvedRole, profile }
    } finally {
      setAuthLoading(false)
    }
  }, [persist])

  const registerStudent = useCallback(async (payload) => {
    setAuthLoading(true)
    try {
      const normalizedPayload = {
        ...payload,
        enrollmentNo: payload.enrollmentNo || payload.rollNumber,
        course: payload.course || payload.program || null,
        year: payload.year ? Number(payload.year) : null,
      }

      delete normalizedPayload.rollNumber

      if (!normalizedPayload.enrollmentNo) {
        throw new Error('Enrollment number is required for registration')
      }

      const { data } = await api.post(AUTH_ENDPOINTS.student.register, normalizedPayload)
      return data
    } finally {
      setAuthLoading(false)
    }
  }, [])

  const registerWarden = useCallback(async (payload) => {
    const { name, email, password, phone, office } = payload || {}
    if (!name || !email || !password || !phone) {
      throw new Error('Name, email, phone, and password are required')
    }

    setAuthLoading(true)
    try {
      const sanitizedPayload = {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        password,
        office: office ? office.trim() : undefined,
      }

      const { data } = await api.post(AUTH_ENDPOINTS.warden.register, sanitizedPayload)
      return data
    } finally {
      setAuthLoading(false)
    }
  }, [])

  const logout = useCallback(() => {
    setToken(null)
    setUser(null)
    setRole(null)
    persist(null, null, null)
  }, [persist])

  const updateStoredUser = useCallback((nextUser) => {
    if (!token || !role) return
    setUser(nextUser)
    persist(token, nextUser, role)
  }, [persist, token, role])

  const value = useMemo(() => ({
    token,
    user,
    role,
    isAuthenticated: Boolean(token),
    authLoading,
    initializing,
    login,
    logout,
    registerStudent,
    registerWarden,
    updateStoredUser,
  }), [token, user, role, authLoading, initializing, login, logout, registerStudent, registerWarden, updateStoredUser])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider')
  }
  return context
}
