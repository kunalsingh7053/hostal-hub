import { useEffect, useState } from 'react'
import api from '../../api/axios'
import Card from '../../components/ui/Card'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import MenuTable from '../../components/feature/MenuTable'
import Loader from '../../components/ui/Loader'
import { useToast } from '../../components/ui/ToastProvider'

const MenuPage = () => {
  const [menu, setMenu] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ day: 'Monday', breakfast: '', lunch: '', snacks: '', dinner: '' })
  const { showToast } = useToast()

  const fetchMenu = async () => {
    setLoading(true)
    try {
      const { data } = await api.get('/menu')
      setMenu(Array.isArray(data) ? data : data?.menu || [])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMenu()
  }, [])

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
      await api.post('/menu', form)
      showToast({ title: 'Menu updated' })
      setForm((prev) => ({ day: prev.day, breakfast: '', lunch: '', snacks: '', dinner: '' }))
      fetchMenu()
    } catch (error) {
      showToast({ title: 'Failed to update', description: error.message, tone: 'error' })
    }
  }

  return (
    <div className="space-y-6">
      <Card title="Update mess menu">
        <form className="grid gap-4 sm:grid-cols-2" onSubmit={handleSubmit}>
          <label className="flex flex-col gap-1 text-sm text-gray-700">
            <span className="font-medium">Day</span>
            <select
              name="day"
              value={form.day}
              onChange={handleChange}
              className="rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                <option key={day}>{day}</option>
              ))}
            </select>
          </label>
          <Input label="Breakfast" name="breakfast" value={form.breakfast} onChange={handleChange} required />
          <Input label="Lunch" name="lunch" value={form.lunch} onChange={handleChange} required />
          <Input label="Snacks" name="snacks" value={form.snacks} onChange={handleChange} required />
          <Input label="Dinner" name="dinner" value={form.dinner} onChange={handleChange} required />
          <Button type="submit" className="sm:col-span-2">
            Save Menu
          </Button>
        </form>
      </Card>
      {loading ? <Loader /> : <MenuTable menu={menu} />}
    </div>
  )
}

export default MenuPage
