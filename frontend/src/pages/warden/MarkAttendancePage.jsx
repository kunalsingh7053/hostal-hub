import { useEffect, useMemo, useState } from 'react'
import api from '../../api/axios'
import Card from '../../components/ui/Card'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import AttendanceTable from '../../components/feature/AttendanceTable'
import Loader from '../../components/ui/Loader'
import { useToast } from '../../components/ui/ToastProvider'

const MarkAttendancePage = () => {
  const today = new Date().toISOString().split('T')[0]
  const [date, setDate] = useState(today)
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const [present, setPresent] = useState(true)
  const [students, setStudents] = useState([])
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(new Set())
  const { showToast } = useToast()

  const fetchAttendance = async (selectedDate = date) => {
    setLoading(true)
    try {
      const { data } = await api.get(`/warden/attendance/date/${selectedDate}`)
      const list = Array.isArray(data) ? data : data?.data || data?.attendance || []
      setRecords(
        list.map((rec) => ({
          ...rec,
          date: rec.date ? rec.date.split('T')[0] : selectedDate,
          studentName: rec.student?.name,
          rollNumber: rec.student?.enrollmentNo,
        })),
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAttendance()
    const loadStudents = async () => {
      try {
        const { data } = await api.get('/students')
        setStudents(Array.isArray(data) ? data : data?.students || [])
      } catch (_err) {
        // ignore load error
      }
    }
    loadStudents()
  }, [])

  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
      if (selected.size === 0) {
        showToast({ title: 'No students selected', tone: 'error' })
        return
      }

      const status = present ? 'Present' : 'Absent'
      const ids = Array.from(selected)

      await Promise.all(
        ids.map((studentId) =>
          api.post('/warden/attendance', {
            date,
            studentId,
            status,
          }),
        ),
      )

      showToast({ title: `Marked ${status.toLowerCase()} for ${ids.length} student(s)` })
      setSelected(new Set())
      setPresent(true)
      fetchAttendance(date)
    } catch (error) {
      showToast({ title: 'Unable to save', description: error.message, tone: 'error' })
    }
  }

  const getStudentId = (s) => s?._id?.toString?.() ?? s?.id?.toString?.()

  const filteredStudents = useMemo(() => {
    const term = search.trim().toLowerCase()
    const list = students.filter((s) => getStudentId(s))
    if (!term) return list
    return list.filter((s) =>
      [s.name, s.email, s.enrollmentNo, s.room?.number]?.some((v) =>
        v?.toString().toLowerCase().includes(term),
      ),
    )
  }, [students, search])

  const toggleSelect = (id) => {
    const key = id?.toString?.() ?? id
    if (!key) return
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(key)) {
        next.delete(key)
      } else {
        next.add(key)
      }
      return next
    })
  }

  const selectAllFiltered = () => {
    const ids = filteredStudents
      .map((s) => getStudentId(s))
      .filter(Boolean)
    setSelected(new Set(ids))
  }

  const clearSelected = () => setSelected(new Set())

  return (
    <div className="space-y-6">
      <Card title="Mark attendance">
        <form className="grid gap-4 sm:grid-cols-4" onSubmit={handleSubmit}>
          <Input
            label="Date"
            type="date"
            value={date}
            onChange={(event) => {
              setDate(event.target.value)
              fetchAttendance(event.target.value)
            }}
          />
          <label className="flex flex-col gap-2 text-sm text-gray-700 sm:col-span-2">
            <div className="flex items-center justify-between">
              <span className="font-medium">Students (multi-select or select all)</span>
              <div className="flex gap-2 text-xs font-semibold">
                <button type="button" className="text-primary" onClick={selectAllFiltered}>
                  Select all
                </button>
                <button type="button" className="text-gray-500" onClick={clearSelected}>
                  Clear
                </button>
              </div>
            </div>
            <input
              className="rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
              placeholder="Search name, email, roll"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
            <div className="max-h-64 overflow-y-auto rounded-xl border border-gray-100 bg-white shadow-sm">
              {filteredStudents.map((student) => {
                const studentId = getStudentId(student)
                const isSelected = studentId ? selected.has(studentId) : false
                return (
                  <label
                    key={studentId}
                    className={`flex w-full cursor-pointer items-center justify-between gap-2 px-3 py-2 text-left text-sm transition hover:bg-gray-50 ${
                      isSelected ? 'bg-primary/5 text-primary' : 'text-gray-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelect(studentId)}
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <div>
                        <div className="font-semibold">{student.name}</div>
                        <div className="text-xs text-gray-500">
                          {student.enrollmentNo}
                          {student.room?.number ? ` • Room ${student.room.number}` : ''}
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] font-semibold uppercase text-gray-400">{isSelected ? 'Selected' : ''}</span>
                  </label>
                )
              })}
              {filteredStudents.length === 0 && (
                <div className="px-3 py-4 text-sm text-gray-500">No students match your search</div>
              )}
            </div>
            <p className="text-xs text-gray-500">Selected: {selected.size}</p>
          </label>
          <label className="flex items-center gap-2 self-end text-sm text-gray-700">
            <input
              type="checkbox"
              checked={present}
              onChange={(event) => setPresent(event.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <span className="font-medium">Present (unchecked = Absent)</span>
          </label>
          <Button type="submit" className="self-end">
            Save
          </Button>
        </form>
      </Card>
      {loading ? <Loader /> : <AttendanceTable records={records} />}
    </div>
  )
}

export default MarkAttendancePage
