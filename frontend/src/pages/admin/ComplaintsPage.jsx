import { useEffect, useState } from 'react'
import api from '../../api/axios'
import Card from '../../components/ui/Card'
import Table from '../../components/ui/Table'
import Button from '../../components/ui/Button'
import Loader from '../../components/ui/Loader'
import { useToast } from '../../components/ui/ToastProvider'

const statusOptions = ['pending', 'in-progress', 'resolved']

const ComplaintsPage = () => {
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

  const updateStatus = async (complaint, nextStatus) => {
    try {
      await api.put(`/complaint/${complaint._id}/status`, { status: nextStatus })
      showToast({ title: 'Status updated' })
      fetchComplaints()
    } catch (error) {
      showToast({ title: 'Unable to update', description: error.message, tone: 'error' })
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
          {statusOptions.map((status) => (
            <Button key={status} size="sm" variant={status === row.status ? 'secondary' : 'ghost'} onClick={() => updateStatus(row, status)}>
              {status}
            </Button>
          ))}
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <Card title="Complaints" description="Track and resolve student complaints" />
      {loading ? <Loader /> : <Table columns={columns} rows={complaints} emptyLabel="No complaints" />}
    </div>
  )
}

export default ComplaintsPage
