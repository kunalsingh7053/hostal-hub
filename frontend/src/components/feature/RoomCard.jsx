const RoomCard = ({ room }) => (
  <article className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
    <div className="flex items-center justify-between">
      <h4 className="text-lg font-semibold text-gray-900">Room {room?.number || room?.roomNumber}</h4>
      <span className="text-xs font-semibold uppercase text-gray-400">{room?.block || 'Block A'}</span>
    </div>
    <p className="mt-2 text-sm text-gray-600">Capacity: {room?.capacity || 0}</p>
    <p className="text-sm text-gray-600">Occupied: {room?.occupied || room?.students?.length || 0}</p>
  </article>
)

export default RoomCard
