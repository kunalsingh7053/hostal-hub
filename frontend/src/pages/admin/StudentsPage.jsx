import { useEffect, useMemo, useState } from 'react'
import api from '../../api/axios'
import Card from '../../components/ui/Card'
import Input from '../../components/ui/Input'
import Table from '../../components/ui/Table'
import Loader from '../../components/ui/Loader'
import Button from '../../components/ui/Button'
import { useToast } from '../../components/ui/ToastProvider'

const StudentsPage = () => {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const { showToast } = useToast()

  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true)
      try {
        const { data } = await api.get('/students')
        setStudents(Array.isArray(data) ? data : data?.students || [])
      } finally {
        setLoading(false)
      }
    }

    fetchStudents()
  }, [])

  const updateStatus = async (student, status) => {
    if (!student?._id) return
    try {
      await api.patch(`/admin/students/${student._id}/status`, { status })
      showToast({ title: 'Status updated' })
      const { data } = await api.get('/students')
      setStudents(Array.isArray(data) ? data : data?.students || [])
    } catch (error) {
      showToast({ title: 'Unable to update', description: error.message, tone: 'error' })
    }
  }

  const filtered = useMemo(() => {
    const value = query.trim().toLowerCase()
    if (!value) return students
    return students.filter((student) =>
      [student.name, student.email, student.enrollmentNo, student.phone].some((field) =>
        field?.toLowerCase().includes(value),
      ),
    )
  }, [students, query])

  const columns = [
    { header: 'Name', accessor: 'name' },
    { header: 'Email', accessor: 'email' },
    { header: 'Enrollment', accessor: 'enrollmentNo' },
    { header: 'Phone', accessor: 'phone' },
    {
      header: 'Status',
      accessor: 'status',
      cell: (row) => (
        <span
          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
            row.status === 'active'
              ? 'bg-emerald-100 text-emerald-700'
              : row.status === 'inactive'
                ? 'bg-amber-100 text-amber-700'
                : 'bg-slate-100 text-slate-700'
          }`}
        >
          {row.status}
        </span>
      ),
    },
    {
      header: 'Approval',
      accessor: 'approvalStatus',
      cell: (row) => (
        <span
          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
            row.approvalStatus === 'approved'
              ? 'bg-emerald-100 text-emerald-700'
              : row.approvalStatus === 'rejected'
                ? 'bg-rose-100 text-rose-700'
                : 'bg-amber-100 text-amber-700'
          }`}
        >
          {row.approvalStatus || 'approved'}
        </span>
      ),
    },
    {
      header: 'Actions',
      accessor: 'actions',
      cell: (row) => (
        <div className="flex flex-wrap gap-2">
          <Button size="sm" variant={row.status === 'active' ? 'secondary' : 'ghost'} onClick={() => updateStatus(row, 'active')}>
            Activate
          </Button>
          <Button size="sm" variant={row.status === 'inactive' ? 'secondary' : 'ghost'} onClick={() => updateStatus(row, 'inactive')}>
            Block
          </Button>
          <Button size="sm" variant={row.status === 'left' ? 'secondary' : 'ghost'} onClick={() => updateStatus(row, 'left')}>
            Mark Left
          </Button>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <Card title="Students" description="Search and manage all onboarded students">
        <Input
          label="Search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search by name, email, roll number"
        />
      </Card>
      {loading ? <Loader /> : <Table columns={columns} rows={filtered} emptyLabel="No students found" />}
    </div>
  )
}

export default StudentsPage
