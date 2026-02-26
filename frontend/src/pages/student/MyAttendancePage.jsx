import { useEffect, useState } from 'react'
import api from '../../api/axios'
import AttendanceTable from '../../components/feature/AttendanceTable'
import Loader from '../../components/ui/Loader'

const MyAttendancePage = () => {
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAttendance = async () => {
      setLoading(true)
      try {
        const { data } = await api.get('/student/attendance/me')
        setRecords(Array.isArray(data) ? data : data?.attendance || [])
      } finally {
        setLoading(false)
      }
    }

    fetchAttendance()
  }, [])

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-900">My Attendance</h1>
      {loading ? <Loader /> : <AttendanceTable records={records} />}
    </div>
  )
}

export default MyAttendancePage
