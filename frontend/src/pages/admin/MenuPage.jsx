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
  const [form, setForm] = useState({ day: 'monday', breakfast: '', lunch: '', snacks: '', dinner: '' })
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
      await api.post('/menu', {
        ...form,
        day: form.day.toLowerCase(),
      })
      showToast({ title: 'Menu updated' })
      setForm((prev) => ({ day: prev.day, breakfast: '', lunch: '', snacks: '', dinner: '' }))
      fetchMenu()
    } catch (error) {
      showToast({ title: 'Failed to update', description: error.message, tone: 'error' })
    }
  }

  const deleteDay = async (entry) => {
    const id = entry._id
    const day = entry.day
    const confirmDelete = window.confirm(`Delete menu for ${day}?`)
    if (!confirmDelete) return

    try {
      if (day) {
        await api.delete(`/menu/day/${day}`)
      } else if (id) {
        await api.delete(`/menu/${id}`)
      }
      showToast({ title: 'Menu deleted' })
      fetchMenu()
    } catch (error) {
      showToast({ title: 'Failed to delete', description: error.message, tone: 'error' })
    }
  }

  const clearAll = async () => {
    const confirmDelete = window.confirm('Clear the entire weekly menu?')
    if (!confirmDelete) return
    try {
      await api.delete('/menu')
      showToast({ title: 'All menu cleared' })
      fetchMenu()
    } catch (error) {
      showToast({ title: 'Failed to clear', description: error.message, tone: 'error' })
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
              {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map((day) => (
                <option key={day} value={day} className="capitalize">
                  {day}
                </option>
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
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-gray-800">Weekly menu</h2>
        <Button variant="destructive" size="sm" onClick={clearAll}>
          Clear all
        </Button>
      </div>
      {loading ? <Loader /> : <MenuTable menu={menu} onDelete={deleteDay} />}
    </div>
  )
}

export default MenuPage
