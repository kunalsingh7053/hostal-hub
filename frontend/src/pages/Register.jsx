import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Card from '../components/ui/Card'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'
import Navbar from '../components/Navbar'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../components/ui/ToastProvider'

const defaultForm = {
  name: '',
  email: '',
  phone: '',
  enrollmentNo: '',
  course: '',
  year: '',
  office: '',
  password: '',
  confirmPassword: '',
}

const roleOptions = [
  { value: 'student', title: 'Student', blurb: 'Residents who need room, mess, and attendance access' },
  { value: 'warden', title: 'Warden', blurb: 'Supervisors who manage floors, notices, and approvals' },
]

const Register = () => {
  const [selectedRole, setSelectedRole] = useState('student')
  const [form, setForm] = useState(() => ({ ...defaultForm }))
  const { registerStudent, registerWarden, authLoading } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const resetForm = () => setForm(() => ({ ...defaultForm }))

  const roleSpecificFields = useMemo(() => {
    if (selectedRole === 'student') {
      return (
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="Enrollment Number" name="enrollmentNo" value={form.enrollmentNo} onChange={handleChange} required />
          <Input label="Programme / Course" name="course" value={form.course} onChange={handleChange} placeholder="B.Tech, MBA, ..." />
          <Input label="Year" type="number" min="1" max="5" name="year" value={form.year} onChange={handleChange} required />
          <Input label="Phone" name="phone" value={form.phone} onChange={handleChange} required />
        </div>
      )
    }

    return (
      <div className="grid gap-4 sm:grid-cols-2">
        <Input label="Contact Number" name="phone" value={form.phone} onChange={handleChange} required />
        <Input label="Assigned Block" name="office" value={form.office} onChange={handleChange} placeholder="North Wing, Block B" required />
      </div>
    )
  }, [form.course, form.enrollmentNo, form.office, form.phone, form.year, selectedRole])

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (form.password !== form.confirmPassword) {
      showToast({ title: 'Passwords do not match', tone: 'error' })
      return
    }

    try {
      if (selectedRole === 'student') {
        await registerStudent({
          name: form.name,
          email: form.email,
          phone: form.phone,
          password: form.password,
          enrollmentNo: form.enrollmentNo,
          course: form.course,
          year: form.year,
        })
      } else {
        await registerWarden({
          name: form.name,
          email: form.email,
          phone: form.phone,
          office: form.office,
          password: form.password,
        })
      }

      showToast({
        title: 'Registration submitted',
        description: 'Admin will verify your request. You can login after approval.',
      })
      resetForm()
      navigate('/login')
    } catch (error) {
      showToast({
        title: 'Registration failed',
        description: error?.response?.data?.msg || error?.response?.data?.message || error.message,
        tone: 'error',
      })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800">
      <Navbar />
      <section className="mx-auto grid max-w-6xl gap-10 px-4 py-16 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6 text-white">
          <p className="text-xs uppercase tracking-[0.4em] text-emerald-300/80">Unified onboarding</p>
          <h1 className="text-4xl font-semibold leading-tight text-emerald-50">One portal for every resident and warden</h1>
          <p className="text-base text-slate-200/80">
            Choose the role you need, submit your details once, and let the admin desk approve your access. No separate
            forms or duplicate data entry.
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            {roleOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  setSelectedRole(option.value)
                  setForm((prev) => ({
                    ...prev,
                    enrollmentNo: '',
                    course: '',
                    year: '',
                    office: '',
                  }))
                }}
                className={`rounded-2xl border-2 px-5 py-4 text-left transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
                  selectedRole === option.value
                    ? 'border-emerald-400/90 bg-emerald-400/10 text-white'
                    : 'border-white/20 bg-white/5 text-white/70 hover:border-white/40'
                }`}
              >
                <p className="text-sm font-semibold uppercase tracking-wide text-emerald-200/90">{option.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-white/80">{option.blurb}</p>
              </button>
            ))}
          </div>
          <div className="rounded-2xl border border-white/15 bg-white/5 p-5 text-sm text-white/80">
            Admin approval is required before anyone can log in. You can always check your status from the login page by
            attempting to sign in.
          </div>
        </div>

        <Card
          title={`${selectedRole === 'student' ? 'Student' : 'Warden'} Access`}
          description="Enter accurate institute details to speed up verification"
          className="bg-white/95 backdrop-blur-lg"
        >
          <form className="space-y-4" onSubmit={handleSubmit}>
            <Input label="Full Name" name="name" value={form.name} onChange={handleChange} required />
            <Input label="Institute Email" type="email" name="email" value={form.email} onChange={handleChange} required />
            {roleSpecificFields}
            <div className="grid gap-4 sm:grid-cols-2">
              <Input label="Password" type="password" name="password" value={form.password} onChange={handleChange} required />
              <Input label="Confirm Password" type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} required />
            </div>
            <Button type="submit" className="w-full" disabled={authLoading}>
              {authLoading ? 'Submitting...' : `Submit as ${selectedRole}`}
            </Button>
            <p className="text-center text-xs text-gray-500">
              By continuing you agree to Hostel Hub&apos;s policies and acknowledge that access is granted only after manual approval.
            </p>
          </form>
        </Card>
        <p className="col-span-full text-center text-sm text-white/80">
          Already part of Hostel Hub?{' '}
          <Link to="/login" className="font-semibold text-emerald-200">
            Sign in
          </Link>
        </p>
      </section>
    </div>
  )
}

export default Register
