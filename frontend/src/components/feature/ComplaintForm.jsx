import { useState } from 'react'
import Input from '../ui/Input'
import Button from '../ui/Button'

const ComplaintForm = ({ onSubmit, loading }) => {
  const [form, setForm] = useState({ title: '', message: '', priority: 'medium' })

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    onSubmit?.(form, () => setForm({ title: '', message: '', priority: 'medium' }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
        <span className="font-medium">Priority</span>
        <select
          name="priority"
          value={form.priority}
          onChange={handleChange}
          className="rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </label>
      <Button type="submit" disabled={loading} className="w-full">
        {loading ? 'Submitting...' : 'Submit Complaint'}
      </Button>
    </form>
  )
}

export default ComplaintForm
