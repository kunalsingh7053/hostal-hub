import { useEffect, useState } from 'react'
import Card from '../../components/ui/Card'
import Loader from '../../components/ui/Loader'
import api from '../../api/axios'

const WardenDashboard = () => {
  const [data, setData] = useState({ attendanceToday: 0, complaints: 0, rooms: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const today = new Date().toISOString().split('T')[0]
        const [attendance, complaints, rooms] = await Promise.all([
          api.get(`/warden/attendance/date/${today}`),
          api.get('/complaints'),
          api.get('/rooms'),
        ])
        setData({
          attendanceToday: attendance.data?.length || attendance.data?.count || 0,
          complaints: (Array.isArray(complaints.data) ? complaints.data : complaints.data?.complaints)?.length || 0,
          rooms: (Array.isArray(rooms.data) ? rooms.data : rooms.data?.rooms)?.length || 0,
        })
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) return <Loader />

  const cards = [
    { label: 'Attendance records today', value: data.attendanceToday },
    { label: 'Open complaints', value: data.complaints },
    { label: 'Rooms managed', value: data.rooms },
  ]

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.4em] text-gray-400">Overview</p>
        <h1 className="text-3xl font-bold text-gray-900">Warden Dashboard</h1>
      </div>
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => (
          <Card key={card.label} title={card.label}>
            <p className="text-4xl font-bold text-gray-900">{card.value}</p>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default WardenDashboard
