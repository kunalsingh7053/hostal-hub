import { useEffect, useMemo, useState } from 'react'
import api from '../../api/axios'
import Card from '../../components/ui/Card'
import Input from '../../components/ui/Input'
import Table from '../../components/ui/Table'
import Loader from '../../components/ui/Loader'

const StudentsPage = () => {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')

  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true)
      try {
        const { data } = await api.get('/user')
        setStudents(Array.isArray(data) ? data : data?.students || [])
      } finally {
        setLoading(false)
      }
    }

    fetchStudents()
  }, [])

  const filtered = useMemo(() => {
    const value = query.trim().toLowerCase()
    if (!value) return students
    return students.filter((student) =>
      [student.name, student.email, student.rollNumber].some((field) =>
        field?.toLowerCase().includes(value),
      ),
    )
  }, [students, query])

  const columns = [
    { header: 'Name', accessor: 'name' },
    { header: 'Email', accessor: 'email' },
    { header: 'Roll', accessor: 'rollNumber' },
    { header: 'Phone', accessor: 'phone' },
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
