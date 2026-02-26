import { useEffect, useState } from 'react'
import Card from '../../components/ui/Card'
import Loader from '../../components/ui/Loader'
import api from '../../api/axios'

const AdminDashboard = () => {
  const [stats, setStats] = useState({ rooms: 0, students: 0, wardens: 0, complaints: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [rooms, students, wardens, complaints] = await Promise.all([
          api.get('/room'),
          api.get('/user'),
          api.get('/warden'),
          api.get('/complaint'),
        ])
        setStats({
          rooms: rooms.data?.length || 0,
          students: students.data?.length || 0,
          wardens: wardens.data?.length || 0,
          complaints: complaints.data?.length || 0,
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
  ]

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.4em] text-gray-400">Overview</p>
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
      </div>
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
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
