import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Card from '../../components/ui/Card'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import Navbar from '../../components/Navbar'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../components/ui/ToastProvider'

const WardenRegister = () => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', office: '', password: '', confirmPassword: '' })
  const { registerWarden, authLoading } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (form.password !== form.confirmPassword) {
      showToast({ title: 'Passwords do not match', tone: 'error' })
      return
    }

    try {
      await registerWarden({
        name: form.name,
        email: form.email,
        phone: form.phone,
        office: form.office,
        password: form.password,
      })
      showToast({ title: 'Warden created', description: 'You can now sign in as a warden' })
      navigate('/login')
    } catch (error) {
      showToast({ title: 'Registration failed', description: error?.response?.data?.msg || error.message, tone: 'error' })
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <section className="mx-auto flex max-w-md flex-col gap-6 px-4 py-16">
        <Card title="Warden Registration" description="Provision access for new warden accounts">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <Input label="Full Name" name="name" value={form.name} onChange={handleChange} required />
            <Input label="Official Email" type="email" name="email" value={form.email} onChange={handleChange} required />
            <Input label="Phone Number" name="phone" value={form.phone} onChange={handleChange} required />
            <Input label="Office / Block" name="office" value={form.office} onChange={handleChange} placeholder="E.g. Block A" />
            <Input label="Password" type="password" name="password" value={form.password} onChange={handleChange} required />
            <Input label="Confirm Password" type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} required />
            <Button type="submit" className="w-full" disabled={authLoading}>
              {authLoading ? 'Creating account...' : 'Register Warden'}
            </Button>
          </form>
        </Card>
        <p className="text-center text-sm text-gray-600">
          Need a student account?{' '}
          <Link to="/register" className="font-semibold text-primary">
            Go to student signup
          </Link>
        </p>
        <p className="text-center text-sm text-gray-600">
          Already a warden?{' '}
          <Link to="/login" className="font-semibold text-primary">
            Sign in
          </Link>
        </p>
      </section>
    </div>
  )
}

export default WardenRegister
