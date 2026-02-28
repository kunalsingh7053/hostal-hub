import { useEffect, useState } from 'react'
import api from '../../api/axios'
import Card from '../../components/ui/Card'
import Table from '../../components/ui/Table'
import Loader from '../../components/ui/Loader'

const WardensPage = () => {
  const [wardens, setWardens] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchWardens = async () => {
      setLoading(true)
      try {
        const { data } = await api.get('/warden')
        setWardens(Array.isArray(data) ? data : data?.wardens || [])
      } finally {
        setLoading(false)
      }
    }

    fetchWardens()
  }, [])

  const columns = [
    { header: 'Name', accessor: 'name' },
    { header: 'Email', accessor: 'email' },
    { header: 'Phone', accessor: 'phone' },
    {
      header: 'Block / Office',
      accessor: 'office',
      cell: (row) => row.office || '—',
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
      header: 'Access',
      accessor: 'access',
      cell: (row) => (
        <span className={`font-semibold ${row.access === 'allowed' ? 'text-emerald-600' : 'text-rose-600'}`}>
          {row.access}
        </span>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <Card title="Wardens" description="Active oversight team" />
      {loading ? <Loader /> : <Table columns={columns} rows={wardens} emptyLabel="No wardens" />}
    </div>
  )
}

export default WardensPage
