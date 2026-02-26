import { useEffect, useState } from 'react'
import api from '../../api/axios'
import Card from '../../components/ui/Card'
import Input from '../../components/ui/Input'
import NoticeCard from '../../components/feature/NoticeCard'
import Button from '../../components/ui/Button'
import Loader from '../../components/ui/Loader'
import { useToast } from '../../components/ui/ToastProvider'

const NoticesPage = () => {
  const [notices, setNotices] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ title: '', description: '', audience: 'All' })
  const { showToast } = useToast()

  const fetchNotices = async () => {
    setLoading(true)
    try {
      const { data } = await api.get('/notice')
      setNotices(Array.isArray(data) ? data : data?.notices || [])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchNotices()
  }, [])

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
      await api.post('/notice', form)
      showToast({ title: 'Notice published' })
      setForm({ title: '', description: '', audience: 'All' })
      fetchNotices()
    } catch (error) {
      showToast({ title: 'Failed to publish', description: error.message, tone: 'error' })
    }
  }

  return (
    <div className="space-y-6">
      <Card title="Publish notice" description="Broadcast important updates">
        <form className="space-y-4" onSubmit={handleSubmit}>
          <Input label="Title" name="title" value={form.title} onChange={handleChange} required />
          <label className="flex flex-col gap-1 text-sm text-gray-700">
            <span className="font-medium">Description</span>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={4}
              className="rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
              required
            />
          </label>
          <label className="flex flex-col gap-1 text-sm text-gray-700">
            <span className="font-medium">Audience</span>
            <select
              name="audience"
              value={form.audience}
              onChange={handleChange}
              className="rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              <option>All</option>
              <option>Students</option>
              <option>Wardens</option>
            </select>
          </label>
          <Button type="submit">Publish Notice</Button>
        </form>
      </Card>
      {loading ? (
        <Loader />
      ) : (
        <div className="grid gap-5 md:grid-cols-2">
          {notices.map((notice) => (
            <NoticeCard key={notice._id} {...notice} />
          ))}
        </div>
      )}
    </div>
  )
}

export default NoticesPage
