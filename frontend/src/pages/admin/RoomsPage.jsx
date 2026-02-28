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
  const [form, setForm] = useState({ id: null, number: '', capacity: '', block: '', floor: '' })
  const { showToast } = useToast()

  const fetchRooms = async () => {
    setLoading(true)
    try {
      const { data } = await api.get('/rooms')
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
      if (form.id) {
        await api.patch(`/rooms/${form.id}`, {
          number: form.number,
          capacity: Number(form.capacity),
          block: form.block,
          floor: form.floor === '' ? null : Number(form.floor),
        })
        showToast({ title: 'Room updated' })
      } else {
        await api.post('/rooms', {
          number: form.number,
          capacity: Number(form.capacity),
          block: form.block,
          floor: form.floor === '' ? null : Number(form.floor),
        })
        showToast({ title: 'Room added' })
      }

      setForm({ id: null, number: '', capacity: '', block: '', floor: '' })
      fetchRooms()
    } catch (error) {
      showToast({ title: 'Unable to save room', description: error.message, tone: 'error' })
    }
  }

  const startEdit = (room) => {
    setForm({
      id: room._id,
      number: room.number || room.roomNumber || '',
      capacity: room.capacity ?? '',
      block: room.block || '',
      floor: room.floor ?? '',
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const deleteRoom = async (room) => {
    if (!room?._id) return
    const confirmDelete = window.confirm('Delete this room? This will unassign occupants.')
    if (!confirmDelete) return

    try {
      await api.delete(`/rooms/${room._id}`)
      showToast({ title: 'Room deleted' })
      fetchRooms()
    } catch (error) {
      showToast({ title: 'Unable to delete', description: error.message, tone: 'error' })
    }
  }

  return (
    <div className="space-y-6">
      <Card title={form.id ? 'Edit Room' : 'Add Room'}>
        <form className="grid gap-4 sm:grid-cols-4" onSubmit={handleSubmit}>
          <Input label="Room Number" name="number" value={form.number} onChange={handleChange} required />
          <Input label="Capacity" name="capacity" type="number" value={form.capacity} onChange={handleChange} required />
          <Input label="Block" name="block" value={form.block} onChange={handleChange} required />
          <Input label="Floor" name="floor" type="number" value={form.floor} onChange={handleChange} />
          <div className="flex gap-3 sm:col-span-4">
            <Button type="submit">{form.id ? 'Update Room' : 'Save Room'}</Button>
            {form.id && (
              <Button type="button" variant="secondary" onClick={() => setForm({ id: null, number: '', capacity: '', block: '', floor: '' })}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      </Card>
      {loading ? (
        <Loader />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {rooms.map((room) => (
            <RoomCard key={room._id || room.number} room={room} onEdit={startEdit} onDelete={deleteRoom} />
          ))}
        </div>
      )}
    </div>
  )
}

export default RoomsPage
