import { useEffect, useState } from 'react'
import api from '../../api/axios'
import MenuTable from '../../components/feature/MenuTable'
import Loader from '../../components/ui/Loader'
import Button from '../../components/ui/Button'

const StudentMenuPage = () => {
  const [menu, setMenu] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedDay, setSelectedDay] = useState('All')

  useEffect(() => {
    const fetchMenu = async () => {
      setLoading(true)
      try {
        const { data } = await api.get('/menu')
        setMenu(Array.isArray(data) ? data : data?.menu || [])
      } finally {
        setLoading(false)
      }
    }

    fetchMenu()
  }, [])

  const filteredMenu = selectedDay === 'All' ? menu : menu.filter((item) => item.day === selectedDay)

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-gray-900">Mess Menu</h1>
        <div className="flex flex-wrap gap-2">
          {['All', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
            <Button key={day} size="sm" variant={selectedDay === day ? 'primary' : 'ghost'} onClick={() => setSelectedDay(day)}>
              {day}
            </Button>
          ))}
        </div>
      </div>
      {loading ? <Loader /> : <MenuTable menu={filteredMenu} />}
    </div>
  )
}

export default StudentMenuPage
