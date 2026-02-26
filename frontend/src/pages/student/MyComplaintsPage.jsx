import { useEffect, useState } from 'react'
import api from '../../api/axios'
import Card from '../../components/ui/Card'
import ComplaintForm from '../../components/feature/ComplaintForm'
import Table from '../../components/ui/Table'
import Loader from '../../components/ui/Loader'
import { useToast } from '../../components/ui/ToastProvider'
import { useAuth } from '../../context/AuthContext'

const MyComplaintsPage = () => {
  const { user } = useAuth()
  const [complaints, setComplaints] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const { showToast } = useToast()

  const fetchComplaints = async () => {
    setLoading(true)
    try {
      const { data } = await api.get('/complaint')
      const allComplaints = Array.isArray(data) ? data : data?.complaints || []
      setComplaints(allComplaints.filter((complaint) => complaint.studentId === user?._id))
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
      await api.post('/complaint', payload)
      showToast({ title: 'Complaint submitted' })
      reset()
      fetchComplaints()
    } catch (error) {
      showToast({ title: 'Unable to submit', description: error.message, tone: 'error' })
    } finally {
      setSubmitting(false)
    }
  }

  const columns = [
    { header: 'Title', accessor: 'title' },
    { header: 'Priority', accessor: 'priority' },
    { header: 'Status', accessor: 'status' },
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
