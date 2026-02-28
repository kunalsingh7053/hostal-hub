import { useEffect, useState } from 'react'
import api from '../../api/axios'
import Card from '../../components/ui/Card'
import ComplaintForm from '../../components/feature/ComplaintForm'
import Table from '../../components/ui/Table'
import Loader from '../../components/ui/Loader'
import { useToast } from '../../components/ui/ToastProvider'
import { useAuth } from '../../context/AuthContext'
import Button from '../../components/ui/Button'

const statusOptions = ['pending', 'in-progress', 'resolved']

const MyComplaintsPage = () => {
  const { user } = useAuth()
  const [complaints, setComplaints] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const { showToast } = useToast()

  const fetchComplaints = async () => {
    setLoading(true)
    try {
      const { data } = await api.get('/complaints/my')
      setComplaints(Array.isArray(data) ? data : [])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchComplaints()
  }, [user])

  const submitComplaint = async (payload, reset) => {
    setSubmitting(true)
    try {
      const body = {
        title: payload.title,
        description: payload.description,
        category: payload.category || 'other',
        priority: payload.priority || 'medium',
      }

      await api.post('/complaints', body)
      showToast({ title: 'Complaint submitted' })
      reset()
      fetchComplaints()
    } catch (error) {
      showToast({ title: 'Unable to submit', description: error.message, tone: 'error' })
    } finally {
      setSubmitting(false)
    }
  }

  const updateStatus = async (complaint, nextStatus) => {
    if (!complaint?._id) return
    try {
      await api.patch(`/complaints/${complaint._id}/status`, { status: nextStatus })
      showToast({ title: 'Status updated' })
      fetchComplaints()
    } catch (error) {
      showToast({ title: 'Unable to update', description: error.message, tone: 'error' })
    }
  }

  const deleteComplaint = async (complaint) => {
    if (!complaint?._id) return
    const confirmDelete = window.confirm('Delete this complaint?')
    if (!confirmDelete) return

    try {
      await api.delete(`/complaints/${complaint._id}`)
      showToast({ title: 'Complaint deleted' })
      fetchComplaints()
    } catch (error) {
      showToast({ title: 'Unable to delete', description: error.message, tone: 'error' })
    }
  }

  const columns = [
    { header: 'Title', accessor: 'title' },
    { header: 'Priority', accessor: 'priority' },
    { header: 'Status', accessor: 'status' },
    {
      header: 'Actions',
      accessor: 'actions',
      cell: (row) => (
        <div className="flex flex-wrap gap-2">
          {statusOptions.map((status) => (
            <Button
              key={status}
              size="sm"
              variant={status === row.status ? 'secondary' : 'ghost'}
              onClick={() => updateStatus(row, status)}
            >
              {status}
            </Button>
          ))}
          <Button size="sm" variant="destructive" onClick={() => deleteComplaint(row)}>
            Delete
          </Button>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <Card title="Raise complaint" description="Explain the issue and track resolution">
        <ComplaintForm onSubmit={submitComplaint} loading={submitting} />
      </Card>
      {loading ? <Loader /> : <Table columns={columns} rows={complaints} emptyLabel="No complaints yet" />}
    </div>
  )
}

export default MyComplaintsPage
