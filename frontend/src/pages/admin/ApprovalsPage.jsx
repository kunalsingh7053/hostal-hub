import { useCallback, useEffect, useState } from 'react'
import Card from '../../components/ui/Card'
import Table from '../../components/ui/Table'
import Loader from '../../components/ui/Loader'
import Button from '../../components/ui/Button'
import api from '../../api/axios'
import { useToast } from '../../components/ui/ToastProvider'

const statusChip = (label) => (
  <span className="inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">{label}</span>
)

const ApprovalsPage = () => {
  const [pending, setPending] = useState({ students: [], wardens: [] })
  const [loading, setLoading] = useState(true)
  const [actioning, setActioning] = useState('')
  const { showToast } = useToast()

  const fetchPending = useCallback(async () => {
    setLoading(true)
    try {
      const { data } = await api.get('/admin/registrations/pending')
      setPending({
        students: data?.students || [],
        wardens: data?.wardens || [],
      })
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchPending()
  }, [fetchPending])

  const handleAction = async (type, id, action) => {
    const key = `${type}-${id}`
    setActioning(key)
    try {
      await api.patch(`/admin/registrations/${type}/${id}`, { action })
      showToast({ title: `${type === 'student' ? 'Student' : 'Warden'} ${action}d` })
      fetchPending()
    } catch (error) {
      showToast({ title: 'Unable to update request', description: error.message, tone: 'error' })
    } finally {
      setActioning('')
    }
  }

  const studentColumns = [
    { header: 'Name', accessor: 'name' },
    { header: 'Email', accessor: 'email' },
    {
      header: 'Details',
      accessor: 'enrollmentNo',
      cell: (row) => (
        <div className="text-sm text-gray-700">
          <p className="font-medium">{row.enrollmentNo}</p>
          <p className="text-gray-500">{row.course || 'Programme'} · Year {row.year || '—'}</p>
        </div>
      ),
    },
    {
      header: 'Requested',
      accessor: 'createdAt',
      cell: (row) => new Date(row.createdAt).toLocaleString(),
    },
    {
      header: 'Actions',
      accessor: 'actions',
      cell: (row) => (
        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            variant="primary"
            disabled={actioning === `student-${row._id}`}
            onClick={() => handleAction('student', row._id, 'approve')}
          >
            Approve
          </Button>
          <Button
            size="sm"
            variant="danger"
            disabled={actioning === `student-${row._id}`}
            onClick={() => handleAction('student', row._id, 'reject')}
          >
            Reject
          </Button>
        </div>
      ),
    },
  ]

  const wardenColumns = [
    { header: 'Name', accessor: 'name' },
    { header: 'Email', accessor: 'email' },
    {
      header: 'Contact',
      accessor: 'phone',
      cell: (row) => (
        <div className="text-sm text-gray-700">
          <p>{row.phone}</p>
          <p className="text-gray-500">{row.office || 'Office tbd'}</p>
        </div>
      ),
    },
    {
      header: 'Requested',
      accessor: 'createdAt',
      cell: (row) => new Date(row.createdAt).toLocaleString(),
    },
    {
      header: 'Actions',
      accessor: 'actions',
      cell: (row) => (
        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            variant="primary"
            disabled={actioning === `warden-${row._id}`}
            onClick={() => handleAction('warden', row._id, 'approve')}
          >
            Approve
          </Button>
          <Button
            size="sm"
            variant="danger"
            disabled={actioning === `warden-${row._id}`}
            onClick={() => handleAction('warden', row._id, 'reject')}
          >
            Reject
          </Button>
        </div>
      ),
    },
  ]

  if (loading) {
    return <Loader label="Loading pending approvals" />
  }

  return (
    <div className="space-y-6">
      <Card title="Students awaiting approval" description="Verify enrollment details before granting hostel access">
        {pending.students.length === 0 ? (
          <div className="flex items-center justify-between rounded-2xl border border-dashed border-emerald-200 bg-emerald-50 px-5 py-6">
            <p className="text-sm text-emerald-800">No student registrations are waiting right now.</p>
            {statusChip('Up to date')}
          </div>
        ) : (
          <>
            <div className="hidden sm:block">
              <Table columns={studentColumns} rows={pending.students} emptyLabel="No pending students" />
            </div>
            <div className="grid gap-3 sm:hidden">
              {pending.students.map((row) => (
                <div key={row._id} className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-base font-semibold text-gray-900 dark:text-slate-100">{row.name}</p>
                      <p className="text-sm text-gray-600 dark:text-slate-300">{row.email}</p>
                      <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">
                        {row.enrollmentNo} • {row.course || 'Programme'} • Year {row.year || '—'}
                      </p>
                      <p className="mt-1 text-xs text-gray-500 dark:text-slate-400">Requested {new Date(row.createdAt).toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      variant="primary"
                      className="flex-1 min-w-[120px]"
                      disabled={actioning === `student-${row._id}`}
                      onClick={() => handleAction('student', row._id, 'approve')}
                    >
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      className="flex-1 min-w-[120px]"
                      disabled={actioning === `student-${row._id}`}
                      onClick={() => handleAction('student', row._id, 'reject')}
                    >
                      Reject
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </Card>

      <Card title="Wardens awaiting approval" description="Approve only verified staff members">
        {pending.wardens.length === 0 ? (
          <div className="flex items-center justify-between rounded-2xl border border-dashed border-amber-200 bg-amber-50 px-5 py-6">
            <p className="text-sm text-amber-800">No pending warden requests.</p>
            {statusChip('Clear')}
          </div>
        ) : (
          <>
            <div className="hidden sm:block">
              <Table columns={wardenColumns} rows={pending.wardens} emptyLabel="No pending wardens" />
            </div>
            <div className="grid gap-3 sm:hidden">
              {pending.wardens.map((row) => (
                <div key={row._id} className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-base font-semibold text-gray-900 dark:text-slate-100">{row.name}</p>
                      <p className="text-sm text-gray-600 dark:text-slate-300">{row.email}</p>
                      <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">{row.phone} • {row.office || 'Office tbd'}</p>
                      <p className="mt-1 text-xs text-gray-500 dark:text-slate-400">Requested {new Date(row.createdAt).toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      variant="primary"
                      className="flex-1 min-w-[120px]"
                      disabled={actioning === `warden-${row._id}`}
                      onClick={() => handleAction('warden', row._id, 'approve')}
                    >
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      className="flex-1 min-w-[120px]"
                      disabled={actioning === `warden-${row._id}`}
                      onClick={() => handleAction('warden', row._id, 'reject')}
                    >
                      Reject
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </Card>
    </div>
  )
}

export default ApprovalsPage
