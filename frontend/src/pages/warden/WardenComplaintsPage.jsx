import { useEffect, useState } from 'react'
import api from '../../api/axios'
import Card from '../../components/ui/Card'
import Table from '../../components/ui/Table'
import Button from '../../components/ui/Button'
import Loader from '../../components/ui/Loader'
import { useToast } from '../../components/ui/ToastProvider'

const WardenComplaintsPage = () => {
  const [complaints, setComplaints] = useState([])
  const [loading, setLoading] = useState(true)
  const { showToast } = useToast()

  const fetchComplaints = async () => {
    setLoading(true)
    try {
      const { data } = await api.get('/complaint')
      setComplaints(Array.isArray(data) ? data : data?.complaints || [])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchComplaints()
  }, [])

  const progress = async (complaint) => {
    try {
      await api.put(`/complaint/${complaint._id}/status`, { status: 'in-progress' })
      showToast({ title: 'Marked in-progress' })
      fetchComplaints()
    } catch (error) {
      showToast({ title: 'Action failed', description: error.message, tone: 'error' })
    }
  }

  const resolve = async (complaint) => {
    try {
      await api.put(`/complaint/${complaint._id}/status`, { status: 'resolved' })
      showToast({ title: 'Complaint resolved' })
      fetchComplaints()
    } catch (error) {
      showToast({ title: 'Action failed', description: error.message, tone: 'error' })
    }
  }

  const columns = [
    { header: 'Title', accessor: 'title' },
    { header: 'Student', accessor: 'studentName' },
    { header: 'Priority', accessor: 'priority' },
    { header: 'Status', accessor: 'status' },
    {
      header: 'Action',
      accessor: 'action',
      cell: (row) => (
        <div className="flex gap-2">
          <Button size="sm" variant="ghost" onClick={() => progress(row)}>
            Progress
          </Button>
          <Button size="sm" variant="primary" onClick={() => resolve(row)}>
            Resolve
          </Button>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <Card title="Complaints" description="Collaborate with admins to close issues" />
      {loading ? <Loader /> : <Table columns={columns} rows={complaints} emptyLabel="No complaints" />}
    </div>
  )
}

export default WardenComplaintsPage
