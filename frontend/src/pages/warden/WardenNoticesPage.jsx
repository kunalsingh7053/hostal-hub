import { useEffect, useState } from 'react'
import api from '../../api/axios'
import NoticeCard from '../../components/feature/NoticeCard'
import Loader from '../../components/ui/Loader'
import Card from '../../components/ui/Card'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import { useToast } from '../../components/ui/ToastProvider'

const WardenNoticesPage = () => {
  const [notices, setNotices] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ title: '', message: '', target: 'all', block: '', floor: '' })
  const { showToast } = useToast()

  useEffect(() => {
    const fetchNotices = async () => {
      setLoading(true)
      try {
        const { data } = await api.get('/notices')
        setNotices(Array.isArray(data) ? data : data?.notices || [])
      } finally {
        setLoading(false)
      }
    }

    fetchNotices()
  }, [])

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
      const payload = {
        title: form.title,
        message: form.message,
        target: form.target,
        block: form.target === 'block' ? form.block : null,
        floor: form.target === 'floor' ? Number(form.floor) || null : null,
      }

      await api.post('/notices', payload)
      showToast({ title: 'Notice published' })
      setForm({ title: '', message: '', target: 'all', block: '', floor: '' })
      const { data } = await api.get('/notices')
      setNotices(Array.isArray(data) ? data : data?.notices || [])
    } catch (error) {
      showToast({ title: 'Failed to publish', description: error.message, tone: 'error' })
    }
  }

  const deleteNotice = async (notice) => {
    if (!notice?._id) return
    const confirmDelete = window.confirm('Delete this notice?')
    if (!confirmDelete) return

    try {
      await api.delete(`/notices/${notice._id}`)
      showToast({ title: 'Notice deleted' })
      const { data } = await api.get('/notices')
      setNotices(Array.isArray(data) ? data : data?.notices || [])
    } catch (error) {
      showToast({ title: 'Failed to delete', description: error.message, tone: 'error' })
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Notice board</h1>

      <Card title="Publish notice" description="Create announcements for residents">
        <form className="space-y-4" onSubmit={handleSubmit}>
          <Input label="Title" name="title" value={form.title} onChange={handleChange} required />
          <label className="flex flex-col gap-1 text-sm text-gray-700">
            <span className="font-medium">Message</span>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              rows={4}
              className="rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
              required
            />
          </label>
          <label className="flex flex-col gap-1 text-sm text-gray-700">
            <span className="font-medium">Audience</span>
            <select
              name="target"
              value={form.target}
              onChange={handleChange}
              className="rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              <option value="all">All</option>
              <option value="block">By Block</option>
              <option value="floor">By Floor</option>
            </select>
          </label>

          {form.target === 'block' && (
            <Input label="Block" name="block" value={form.block} onChange={handleChange} required />
          )}

          {form.target === 'floor' && (
            <Input label="Floor" name="floor" type="number" value={form.floor} onChange={handleChange} required />
          )}

          <Button type="submit">Publish Notice</Button>
        </form>
      </Card>

      {loading ? (
        <Loader />
      ) : (
        <div className="grid gap-5 md:grid-cols-2">
          {notices.map((notice) => (
            <NoticeCard key={notice._id} {...notice} onDelete={() => deleteNotice(notice)} />
          ))}
        </div>
      )}
    </div>
  )
}

export default WardenNoticesPage
