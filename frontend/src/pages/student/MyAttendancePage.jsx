import { useEffect, useState } from 'react'
import api from '../../api/axios'
import AttendanceTable from '../../components/feature/AttendanceTable'
import Loader from '../../components/ui/Loader'

const MyAttendancePage = () => {
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)

  const presentCount = records.filter((record) => record.status === 'Present').length
  const totalCount = records.length
  const percentage = totalCount ? Math.round((presentCount / totalCount) * 100) : 0

  const badgeClass = percentage > 60
    ? 'bg-green-100 text-green-800'
    : percentage >= 40
      ? 'bg-yellow-100 text-yellow-800'
      : 'bg-red-100 text-red-800'

  useEffect(() => {
    const fetchAttendance = async () => {
      setLoading(true)
      try {
        const { data } = await api.get('/student/attendance/my')
        setRecords(Array.isArray(data) ? data : data?.attendance || [])
      } finally {
        setLoading(false)
      }
    }

    fetchAttendance()
  }, [])

  return (
    <div className="space-y-4">
      <p>-</p>
      <h1 className="text-2xl font-bold text-gray-900">My Attendance</h1>
      {!loading && (
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Attendance percentage</p>
              <p className="text-3xl font-semibold text-gray-900">{percentage}%</p>
            </div>
            <span className={`rounded-full px-3 py-1 text-sm font-medium ${badgeClass}`}>
              {percentage > 60 ? 'Good' : percentage >= 40 ? 'Warning' : 'Low'}
            </span>
          </div>
          <p className="mt-2 text-xs text-gray-500">
            Present {presentCount} / {totalCount || 0} records
          </p>
        </div>
      )}
      {loading ? <Loader /> : <AttendanceTable records={records} />}
    </div>
  )
}

export default MyAttendancePage
