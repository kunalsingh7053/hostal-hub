import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Card from '../components/ui/Card'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'
import Navbar from '../components/Navbar'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../components/ui/ToastProvider'

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', rollNumber: '' })
  const { registerStudent, authLoading } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
      await registerStudent(form)
      showToast({ title: 'Registration success', description: 'Login with your new credentials' })
      navigate('/login')
    } catch (error) {
      showToast({ title: 'Registration failed', description: error?.response?.data?.message || error.message, tone: 'error' })
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <section className="mx-auto flex max-w-md flex-col gap-6 px-4 py-16">
        <Card title="Student Registration" description="Create your Hostel Hub account">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <Input label="Full Name" name="name" value={form.name} onChange={handleChange} required />
            <Input label="Official Email" type="email" name="email" value={form.email} onChange={handleChange} required />
            <Input label="Phone Number" name="phone" value={form.phone} onChange={handleChange} required />
            <Input label="Roll Number" name="rollNumber" value={form.rollNumber} onChange={handleChange} required />
            <Input label="Password" type="password" name="password" value={form.password} onChange={handleChange} required />
            <Button type="submit" className="w-full" disabled={authLoading}>
              {authLoading ? 'Creating account...' : 'Register'}
            </Button>
          </form>
        </Card>
        <p className="text-center text-sm text-gray-600">
          Already registered?{' '}
          <Link to="/login" className="font-semibold text-primary">
            Sign in
          </Link>
        </p>
        <p className="text-center text-sm text-gray-600">
          Need access for wardens?{' '}
          <Link to="/warden/register" className="font-semibold text-primary">
            Create warden account
          </Link>
        </p>
      </section>
    </div>
  )
}

export default Register
