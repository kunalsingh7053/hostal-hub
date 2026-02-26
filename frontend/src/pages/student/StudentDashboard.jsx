import { useEffect, useState } from 'react'
import Card from '../../components/ui/Card'
import Loader from '../../components/ui/Loader'
import api from '../../api/axios'
import { useAuth } from '../../context/AuthContext'

const StudentDashboard = () => {
  const { user } = useAuth()
  const [data, setData] = useState({ attendance: 0, complaints: 0, room: user?.roomNumber || 'Unassigned' })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const [attendanceResponse, complaintsResponse] = await Promise.all([
          api.get('/student/attendance/me'),
          api.get('/complaint'),
        ])

        const myComplaints = (Array.isArray(complaintsResponse.data)
          ? complaintsResponse.data
          : complaintsResponse.data?.complaints || []
        ).filter((complaint) => complaint.studentId === user?._id)

        setData({
          attendance: attendanceResponse.data?.length || attendanceResponse.data?.count || 0,
          complaints: myComplaints.length,
          room: user?.roomNumber || user?.room?.number || 'Unassigned',
        })
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [user])

  if (loading) return <Loader />

  const cards = [
    { label: 'Attendance entries', value: data.attendance },
    { label: 'Complaints raised', value: data.complaints },
    { label: 'Room', value: data.room },
  ]

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.4em] text-gray-400">Welcome back</p>
        <h1 className="text-3xl font-bold text-gray-900">Student Dashboard</h1>
      </div>
      <div className="grid gap-5 sm:grid-cols-3">
        {cards.map((card) => (
          <Card key={card.label} title={card.label}>
            <p className="text-4xl font-bold text-gray-900">{card.value}</p>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default StudentDashboard
