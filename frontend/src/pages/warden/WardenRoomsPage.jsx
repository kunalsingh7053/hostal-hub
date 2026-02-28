import { useEffect, useState } from 'react'
import api from '../../api/axios'
import RoomCard from '../../components/feature/RoomCard'
import Loader from '../../components/ui/Loader'

const WardenRoomsPage = () => {
  const [rooms, setRooms] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRooms = async () => {
      setLoading(true)
      try {
        const { data } = await api.get('/rooms')
        setRooms(Array.isArray(data) ? data : data?.rooms || [])
      } finally {
        setLoading(false)
      }
    }

    fetchRooms()
  }, [])

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Rooms overview</h1>
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

export default WardenRoomsPage
