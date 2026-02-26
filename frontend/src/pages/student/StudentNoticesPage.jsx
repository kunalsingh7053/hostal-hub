import { useEffect, useState } from 'react'
import api from '../../api/axios'
import NoticeCard from '../../components/feature/NoticeCard'
import Loader from '../../components/ui/Loader'

const StudentNoticesPage = () => {
  const [notices, setNotices] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchNotices = async () => {
      setLoading(true)
      try {
        const { data } = await api.get('/notice')
        setNotices(Array.isArray(data) ? data : data?.notices || [])
      } finally {
        setLoading(false)
      }
    }

    fetchNotices()
  }, [])

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-900">Notices</h1>
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

export default StudentNoticesPage
