import { useEffect, useState } from 'react'
import api from '../../api/axios'
import Card from '../../components/ui/Card'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import AttendanceTable from '../../components/feature/AttendanceTable'
import Loader from '../../components/ui/Loader'
import { useToast } from '../../components/ui/ToastProvider'

const MarkAttendancePage = () => {
  const today = new Date().toISOString().split('T')[0]
  const [date, setDate] = useState(today)
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ studentId: '', status: 'Present' })
  const { showToast } = useToast()

  const fetchAttendance = async (selectedDate = date) => {
    setLoading(true)
    try {
      const { data } = await api.get(`/warden/attendance/date/${selectedDate}`)
      setRecords(Array.isArray(data) ? data : data?.attendance || [])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAttendance()
  }, [])

  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
      await api.post('/warden/attendance', {
        date,
        studentId: form.studentId,
        status: form.status,
      })
      showToast({ title: 'Attendance saved' })
      setForm({ studentId: '', status: 'Present' })
      fetchAttendance(date)
    } catch (error) {
      showToast({ title: 'Unable to save', description: error.message, tone: 'error' })
    }
  }

  return (
    <div className="space-y-6">
      <Card title="Mark attendance">
        <form className="grid gap-4 sm:grid-cols-4" onSubmit={handleSubmit}>
          <Input
            label="Date"
            type="date"
            value={date}
            onChange={(event) => {
              setDate(event.target.value)
              fetchAttendance(event.target.value)
            }}
          />
          <Input
            label="Student ID"
            name="studentId"
            value={form.studentId}
            onChange={(event) => setForm((prev) => ({ ...prev, studentId: event.target.value }))}
            required
          />
          <label className="flex flex-col gap-1 text-sm text-gray-700">
            <span className="font-medium">Status</span>
            <select
              className="rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
              value={form.status}
              onChange={(event) => setForm((prev) => ({ ...prev, status: event.target.value }))}
            >
              <option>Present</option>
              <option>Absent</option>
            </select>
          </label>
          <Button type="submit" className="self-end">
            Save
          </Button>
        </form>
      </Card>
      {loading ? <Loader /> : <AttendanceTable records={records} />}
    </div>
  )
}

export default MarkAttendancePage
