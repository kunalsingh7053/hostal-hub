import { useEffect, useMemo, useState } from 'react'
import api from '../../api/axios'
import Card from '../../components/ui/Card'
import Input from '../../components/ui/Input'
import Table from '../../components/ui/Table'
import Loader from '../../components/ui/Loader'
import Button from '../../components/ui/Button'
import { useToast } from '../../components/ui/ToastProvider'

const StudentsPage = ({ mode = 'admin' }) => {
  const [students, setStudents] = useState([])
  const [rooms, setRooms] = useState([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [selection, setSelection] = useState({})
  const { showToast } = useToast()

  const canUpdateStatus = mode === 'admin'

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const [studentsRes, roomsRes] = await Promise.all([
          api.get('/students'),
          api.get('/rooms'),
        ])
        setStudents(Array.isArray(studentsRes.data) ? studentsRes.data : studentsRes.data?.students || [])
        setRooms(Array.isArray(roomsRes.data) ? roomsRes.data : roomsRes.data?.rooms || [])
      } finally {
        setLoading(false)
      }
    }

    fetchData()
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

  const assignRoom = async (student) => {
    const roomId = selection[student._id]
    if (!roomId) {
      showToast({ title: 'Select a room first', tone: 'error' })
      return
    }
    try {
      await api.post('/rooms/allocate', { roomId, studentId: student._id })
      showToast({ title: 'Room assigned' })
      const [studentsRes, roomsRes] = await Promise.all([api.get('/students'), api.get('/rooms')])
      setStudents(Array.isArray(studentsRes.data) ? studentsRes.data : studentsRes.data?.students || [])
      setRooms(Array.isArray(roomsRes.data) ? roomsRes.data : roomsRes.data?.rooms || [])
    } catch (error) {
      showToast({ title: 'Unable to assign', description: error.response?.data?.msg || error.message, tone: 'error' })
    }
  }

  const removeRoom = async (student) => {
    if (!student?.room?._id) return
    try {
      await api.post('/rooms/remove', { roomId: student.room._id, studentId: student._id })
      showToast({ title: 'Room removed' })
      const [studentsRes, roomsRes] = await Promise.all([api.get('/students'), api.get('/rooms')])
      setStudents(Array.isArray(studentsRes.data) ? studentsRes.data : studentsRes.data?.students || [])
      setRooms(Array.isArray(roomsRes.data) ? roomsRes.data : roomsRes.data?.rooms || [])
    } catch (error) {
      showToast({ title: 'Unable to remove', description: error.response?.data?.msg || error.message, tone: 'error' })
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
      header: 'Room',
      accessor: 'room',
      cell: (row) => {
        const currentRoomId = row.room?._id || row.room?.id
        return (
          <div className="space-y-2">
            <div className="inline-flex rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
              {row.room?.roomNumber || 'Unassigned'}
            </div>
            <select
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-gray-400 focus:outline-none"
              value={selection[row._id] || ''}
              onChange={(e) => setSelection((prev) => ({ ...prev, [row._id]: e.target.value }))}
            >
              <option value="">Select room</option>
              {rooms.map((room) => {
                const occupied = room.occupants?.length ?? 0
                const full = occupied >= room.capacity && room._id !== currentRoomId
                const label = room.roomNumber || room.number
                return (
                  <option key={room._id} value={room._id} disabled={full}>
                    {label} ({occupied}/{room.capacity})
                    {full ? ' - Full' : ''}
                  </option>
                )
              })}
            </select>
            <div className="flex gap-2">
              <Button size="sm" onClick={() => assignRoom(row)}>Assign</Button>
              <Button size="sm" variant="ghost" disabled={!row.room?._id} onClick={() => removeRoom(row)}>
                Remove
              </Button>
            </div>
          </div>
        )
      },
    },
    ...(canUpdateStatus
      ? [
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
      : []),
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
