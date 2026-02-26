import { useEffect, useState } from 'react'
import api from '../../api/axios'
import Card from '../../components/ui/Card'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import RoomCard from '../../components/feature/RoomCard'
import Loader from '../../components/ui/Loader'
import { useToast } from '../../components/ui/ToastProvider'

const RoomsPage = () => {
  const [rooms, setRooms] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ number: '', capacity: '', block: '' })
  const { showToast } = useToast()

  const fetchRooms = async () => {
    setLoading(true)
    try {
      const { data } = await api.get('/room')
      setRooms(Array.isArray(data) ? data : data?.rooms || [])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRooms()
  }, [])

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
      await api.post('/room', {
        number: form.number,
        capacity: Number(form.capacity),
        block: form.block,
      })
      showToast({ title: 'Room added' })
      setForm({ number: '', capacity: '', block: '' })
      fetchRooms()
    } catch (error) {
      showToast({ title: 'Unable to add room', description: error.message, tone: 'error' })
    }
  }

  return (
    <div className="space-y-6">
      <Card title="Add Room">
        <form className="grid gap-4 sm:grid-cols-3" onSubmit={handleSubmit}>
          <Input label="Room Number" name="number" value={form.number} onChange={handleChange} required />
          <Input label="Capacity" name="capacity" type="number" value={form.capacity} onChange={handleChange} required />
          <Input label="Block" name="block" value={form.block} onChange={handleChange} required />
          <Button type="submit" className="sm:col-span-3">
            Save Room
          </Button>
        </form>
      </Card>
      {loading ? (
        <Loader />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {rooms.map((room) => (
            <RoomCard key={room._id || room.number} room={room} />
          ))}
        </div>
      )}
    </div>
  )
}

export default RoomsPage
