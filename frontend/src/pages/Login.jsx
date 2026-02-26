import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import Navbar from '../components/Navbar'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../components/ui/ToastProvider'
import { getDashboardPath } from '../utils/routes'

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '', selectedRole: 'student' })
  const { login, authLoading } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
      const { role } = await login(form)
      showToast({ title: 'Welcome back', description: 'Redirecting to your dashboard' })
      navigate(getDashboardPath(role))
    } catch (error) {
      showToast({ title: 'Login failed', description: error?.response?.data?.message || error.message, tone: 'error' })
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <section className="mx-auto flex max-w-md flex-col gap-6 px-4 py-16">
        <Card title="Login" description="Access your personalized dashboard">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <Input label="Institution Email" type="email" name="email" value={form.email} onChange={handleChange} required />
            <Input label="Password" type="password" name="password" value={form.password} onChange={handleChange} required />
            <label className="flex flex-col gap-1 text-sm text-gray-700">
              <span className="font-medium">Login as</span>
              <select
                name="selectedRole"
                value={form.selectedRole}
                onChange={handleChange}
                className="rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                <option value="student">Student</option>
                <option value="warden">Warden</option>
                <option value="admin">Admin</option>
              </select>
            </label>
            <Button type="submit" className="w-full" disabled={authLoading}>
              {authLoading ? 'Signing in...' : 'Login'}
            </Button>
          </form>
        </Card>
        <p className="text-center text-sm text-gray-600">
          New student?{' '}
          <Link to="/register" className="font-semibold text-primary">
            Register your account
          </Link>
        </p>
      </section>
    </div>
  )
}

export default Login
