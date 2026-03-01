import { useEffect, useMemo, useState } from 'react'
import Card from '../components/ui/Card'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'
import Loader from '../components/ui/Loader'
import { useToast } from '../components/ui/ToastProvider'
import { useAuth } from '../context/AuthContext'
import { useApi } from '../hooks/useApi'
import api from '../api/axios'

const roleProfiles = {
  admin: {
    title: 'Admin Profile',
    description: 'Primary administrator account',
    fetchUrl: '/admin/me',
    updateUrl: null,
    fields: [
      { name: 'name', label: 'Name' },
      { name: 'email', label: 'Email', type: 'email' },
    ],
    mapProfile: (profile) => ({
      name: profile?.name || '',
      email: profile?.email || '',
    }),
  },
  warden: {
    title: 'Warden Profile',
    description: 'Contact details and office info',
    fetchUrl: '/warden/me',
    updateUrl: null,
    fields: [
      { name: 'name', label: 'Name', required: true },
      { name: 'email', label: 'Email', type: 'email', readOnly: true },
      { name: 'phone', label: 'Phone', required: true },
      { name: 'office', label: 'Office / Block' },
      { name: 'approvalStatus', label: 'Approval Status', readOnly: true },
      { name: 'access', label: 'Access', readOnly: true },
    ],
    mapProfile: (profile) => ({
      name: profile?.name || '',
      email: profile?.email || '',
      phone: profile?.phone || '',
      office: profile?.office || '',
      approvalStatus: profile?.approvalStatus || 'pending',
      access: profile?.access || 'blocked',
    }),
  },
  student: {
    title: 'Student Profile',
    description: 'Personal, academic, and guardian details',
    fetchUrl: '/students/me',
    updateUrl: null,
    fields: [
      { name: 'name', label: 'Name', required: true },
      { name: 'email', label: 'Email', type: 'email', readOnly: true },
      { name: 'phone', label: 'Phone', required: true },
      { name: 'enrollmentNo', label: 'Enrollment No.', readOnly: true },
      { name: 'course', label: 'Course / Program' },
      { name: 'year', label: 'Year', type: 'number', min: 1, max: 5 },
      { name: 'guardianName', label: 'Guardian Name' },
      { name: 'guardianPhone', label: 'Guardian Phone' },
      { name: 'status', label: 'Status', readOnly: true },
      { name: 'approvalStatus', label: 'Approval Status', readOnly: true },
    ],
    mapProfile: (profile) => ({
      name: profile?.name || '',
      email: profile?.email || '',
      phone: profile?.phone || '',
      enrollmentNo: profile?.enrollmentNo || '',
      course: profile?.course || '',
      year: profile?.year ?? '',
      guardianName: profile?.guardianName || '',
      guardianPhone: profile?.guardianPhone || '',
      status: profile?.status || 'active',
      approvalStatus: profile?.approvalStatus || 'pending',
    }),
  },
}

const formatDate = (value) => {
  if (!value) return '—'
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? '—' : date.toLocaleDateString()
}

const ProfilePage = () => {
  const { role, user, updateStoredUser } = useAuth()
  const { showToast } = useToast()
  const [form, setForm] = useState({})
  const [saving, setSaving] = useState(false)

  const config = useMemo(() => roleProfiles[role] || roleProfiles.student, [role])
  const { data, loading, error, refetch } = useApi(config.fetchUrl, { immediate: Boolean(config.fetchUrl) })

  const profile = config.fetchUrl ? data : user

  useEffect(() => {
    if (profile) {
      setForm(config.mapProfile(profile))
    }
  }, [profile, config])

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    // Updates disabled
  }

  if (loading) return <Loader label="Loading profile" />
  if (error) return <Card title="Profile" description="Failed to load"><p className="text-sm text-rose-600">{error?.response?.data?.msg || error.message}</p></Card>

  const readonly = !config.updateUrl
  const meta = profile || {}

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-500">Profile</p>
          <h1 className="text-2xl font-bold text-gray-900">{config.title}</h1>
          {config.description && <p className="text-sm text-gray-600">{config.description}</p>}
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span className="rounded-full bg-gray-100 px-3 py-1 font-medium">Role: {role}</span>
          {meta.approvalStatus && (
            <span className="rounded-full bg-emerald-50 px-3 py-1 font-medium text-emerald-700">{meta.approvalStatus}</span>
          )}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <Card title="Identity" className="sm:col-span-1" description="Account overview">
          <dl className="space-y-3 text-sm text-gray-700">
            <div className="flex justify-between">
              <dt className="text-gray-500">Name</dt>
              <dd className="font-semibold text-gray-900">{meta.name || '—'}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Email</dt>
              <dd className="font-semibold text-gray-900">{meta.email || '—'}</dd>
            </div>
            {meta.enrollmentNo && (
              <div className="flex justify-between">
                <dt className="text-gray-500">Enrollment</dt>
                <dd className="font-semibold text-gray-900">{meta.enrollmentNo}</dd>
              </div>
            )}
            {meta.phone && (
              <div className="flex justify-between">
                <dt className="text-gray-500">Phone</dt>
                <dd className="font-semibold text-gray-900">{meta.phone}</dd>
              </div>
            )}
            <div className="flex justify-between">
              <dt className="text-gray-500">Created</dt>
              <dd className="font-semibold text-gray-900">{formatDate(meta.createdAt)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Updated</dt>
              <dd className="font-semibold text-gray-900">{formatDate(meta.updatedAt)}</dd>
            </div>
          </dl>
        </Card>

        <Card title="Status" className="sm:col-span-1" description="Access and approvals">
          <div className="space-y-3 text-sm text-gray-700">
            {meta.status && (
              <div className="flex items-center justify-between rounded-xl bg-gray-50 px-3 py-2">
                <span className="text-gray-600">Status</span>
                <span className="font-semibold capitalize">{meta.status}</span>
              </div>
            )}
            {meta.approvalStatus && (
              <div className="flex items-center justify-between rounded-xl bg-gray-50 px-3 py-2">
                <span className="text-gray-600">Approval</span>
                <span className="font-semibold capitalize">{meta.approvalStatus}</span>
              </div>
            )}
            {meta.access && (
              <div className="flex items-center justify-between rounded-xl bg-gray-50 px-3 py-2">
                <span className="text-gray-600">Access</span>
                <span className="font-semibold capitalize">{meta.access}</span>
              </div>
            )}
            {meta.room && meta.room.name && (
              <div className="flex items-center justify-between rounded-xl bg-gray-50 px-3 py-2">
                <span className="text-gray-600">Room</span>
                <span className="font-semibold">{meta.room.name}</span>
              </div>
            )}
          </div>
        </Card>

        <Card title="Security" className="xl:col-span-1" description="Session context">
          <div className="space-y-2 text-sm text-gray-700">
            <p className="rounded-xl bg-sky-50 px-3 py-2 font-medium text-sky-800">Signed in as {role}</p>
            <p className="text-gray-600">Use your institutional email for login. Contact admin if you need to reset access.</p>
          </div>
        </Card>
      </div>

      <Card title="Profile details" description="Profile updates are disabled by admin.">
        <div className="grid gap-4 md:grid-cols-2">
          {config.fields.map((field) => (
            <Input
              key={field.name}
              label={field.label}
              name={field.name}
              type={field.type || 'text'}
              value={form[field.name] ?? ''}
              readOnly
            />
          ))}
        </div>
      </Card>
    </div>
  )
}

export default ProfilePage
