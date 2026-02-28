import { useEffect, useState } from 'react'
import api from '../../api/axios'
import Card from '../../components/ui/Card'
import Table from '../../components/ui/Table'
import Loader from '../../components/ui/Loader'
import Button from '../../components/ui/Button'
import { useToast } from '../../components/ui/ToastProvider'

const ComplaintsPage = () => {
  const [complaints, setComplaints] = useState([])
  const [loading, setLoading] = useState(true)
  const { showToast } = useToast()

  const fetchComplaints = async () => {
    setLoading(true)
    try {
      const { data } = await api.get('/admin/complaints')
      const list = Array.isArray(data) ? data : data?.complaints || []
      setComplaints(
        list.map((complaint) => ({
          ...complaint,
          studentName: complaint?.user?.name || 'Unknown',
          priority: complaint?.priority || 'normal',
        })),
      )
    } finally {
      setLoading(false)
    }
  }

  const deleteComplaint = async (complaint) => {
    const id = complaint._id || complaint.id
    if (!id) return
    const confirmDelete = window.confirm('Delete this complaint?')
    if (!confirmDelete) return

    try {
      await api.delete(`/complaints/${id}`)
      showToast({ title: 'Complaint deleted' })
      fetchComplaints()
    } catch (error) {
      showToast({ title: 'Unable to delete', description: error.message, tone: 'error' })
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
    {
      header: 'Actions',
      accessor: 'actions',
      cell: (row) => (
        <Button size="sm" variant="destructive" onClick={() => deleteComplaint(row)}>
          Delete
        </Button>
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
