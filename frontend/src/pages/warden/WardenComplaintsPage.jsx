import { useEffect, useState } from 'react'
import api from '../../api/axios'
import Card from '../../components/ui/Card'
import Table from '../../components/ui/Table'
import Loader from '../../components/ui/Loader'
import { useToast } from '../../components/ui/ToastProvider'

const WardenComplaintsPage = () => {
  const [complaints, setComplaints] = useState([])
  const [loading, setLoading] = useState(true)
  const { showToast } = useToast()

  const fetchComplaints = async () => {
    setLoading(true)
    try {
      const { data } = await api.get('/complaints')
      setComplaints(Array.isArray(data) ? data : data?.complaints || [])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchComplaints()
  }, [])

  const columns = [
    { header: 'Title', accessor: 'title' },
    { header: 'Student', accessor: 'studentName' },
    { header: 'Priority', accessor: 'priority' },
    { header: 'Status', accessor: 'status' },
  ]

  return (
    <div className="space-y-6">
      <Card title="Complaints" description="Collaborate with admins to close issues" />
      {loading ? <Loader /> : <Table columns={columns} rows={complaints} emptyLabel="No complaints" />}
    </div>
  )
}

export default WardenComplaintsPage
