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
    { header: 'Block', accessor: 'block' },
  ]

  return (
    <div className="space-y-6">
      <Card title="Wardens" description="Active oversight team" />
      {loading ? <Loader /> : <Table columns={columns} rows={wardens} emptyLabel="No wardens" />}
    </div>
  )
}

export default WardensPage
