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
        const [profileRes, roomsRes] = await Promise.all([
          api.get('/students/me'),
          api.get('/rooms'),
        ])

        const profile = profileRes.data || {}
        const rooms = Array.isArray(roomsRes.data) ? roomsRes.data : roomsRes.data?.rooms || []
        const roomId = profile?.room?._id || profile?.room

        // Prefer the room directly from profile if present
        let assigned = rooms.find((item) => (item?._id || item?.id)?.toString() === roomId?.toString())

        // Fallback: match by occupants
        if (!assigned && profile?._id) {
          assigned = rooms.find((item) =>
            item?.occupants?.some((occupant) => (occupant?._id || occupant)?.toString() === profile._id?.toString()),
          )
        }

        if (assigned) {
          setRoom({ ...assigned, occupied: assigned?.occupants?.length || assigned?.students?.length || 0 })
        } else {
          setRoom({
            roomNumber: 'Not assigned yet',
            capacity: '-',
            occupied: '-',
            block: null,
          })
        }
      } finally {
        setLoading(false)
      }
    }

    fetchRoom()
  }, [])

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-900">My Room</h1>
      {loading ? <Loader /> : <RoomCard room={room} />}
    </div>
  )
}

export default MyRoomPage
