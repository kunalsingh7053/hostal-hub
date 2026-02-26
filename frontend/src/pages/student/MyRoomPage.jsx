import { useEffect, useState } from 'react'
import api from '../../api/axios'
import Loader from '../../components/ui/Loader'
import RoomCard from '../../components/feature/RoomCard'
import { useAuth } from '../../context/AuthContext'

const MyRoomPage = () => {
  const { user } = useAuth()
  const [room, setRoom] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRoom = async () => {
      setLoading(true)
      try {
        const { data } = await api.get('/room')
        const rooms = Array.isArray(data) ? data : data?.rooms || []
        const assigned = rooms.find((item) => item.students?.some((student) => student._id === user?._id))
        setRoom(assigned || { number: user?.roomNumber || 'Not assigned yet', capacity: '-', occupied: '-' })
      } finally {
        setLoading(false)
      }
    }

    fetchRoom()
  }, [user])

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-900">My Room</h1>
      {loading ? <Loader /> : <RoomCard room={room} />}
    </div>
  )
}

export default MyRoomPage
