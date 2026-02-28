import { useEffect, useState } from 'react'
import Card from '../../components/ui/Card'
import Loader from '../../components/ui/Loader'
import api from '../../api/axios'

const AdminDashboard = () => {
  const [stats, setStats] = useState({ rooms: 0, students: 0, wardens: 0, complaints: 0, pending: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [rooms, students, wardens, complaints, pending] = await Promise.all([
          api.get('/rooms'),
          api.get('/students'),
          api.get('/warden'),
          api.get('/complaints'),
          api.get('/admin/registrations/pending'),
        ])

        setStats({
          rooms: Array.isArray(rooms.data) ? rooms.data.length : rooms.data?.rooms?.length || 0,
          students: Array.isArray(students.data) ? students.data.length : students.data?.students?.length || 0,
          wardens: Array.isArray(wardens.data) ? wardens.data.length : wardens.data?.wardens?.length || 0,
          complaints: Array.isArray(complaints.data) ? complaints.data.length : complaints.data?.complaints?.length || 0,
          pending: (pending.data?.students?.length || 0) + (pending.data?.wardens?.length || 0),
        })
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return <Loader />
  }

  const cards = [
    { label: 'Total Rooms', value: stats.rooms },
    { label: 'Active Students', value: stats.students },
    { label: 'Warden Team', value: stats.wardens },
    { label: 'Open Complaints', value: stats.complaints },
    { label: 'Pending Approvals', value: stats.pending },
  ]

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.4em] text-gray-400">Overview</p>
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
      </div>
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-5">
        {cards.map((card) => (
          <Card key={card.label} className="bg-gradient-to-br from-white to-gray-50" title={card.label}>
            <p className="text-4xl font-bold text-gray-900">{card.value}</p>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default AdminDashboard
