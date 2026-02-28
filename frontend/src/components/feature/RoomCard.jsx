const RoomCard = ({ room, onEdit, onDelete }) => (
  <article className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
    <div className="flex items-center justify-between gap-2">
      <div>
        <h4 className="text-lg font-semibold text-gray-900">Room {room?.number || room?.roomNumber}</h4>
        <p className="text-xs font-semibold uppercase text-gray-400">{room?.block || 'Block A'}</p>
      </div>
      {(onEdit || onDelete) && (
        <div className="flex gap-2">
          {onEdit && (
            <button
              type="button"
              className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-700 transition hover:bg-gray-50"
              onClick={() => onEdit(room)}
            >
              Edit
            </button>
          )}
          {onDelete && (
            <button
              type="button"
              className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-50"
              onClick={() => onDelete(room)}
            >
              Delete
            </button>
          )}
        </div>
      )}
    </div>
    <p className="mt-2 text-sm text-gray-600">Capacity: {room?.capacity || 0}</p>
    <p className="text-sm text-gray-600">Occupied: {room?.occupied || room?.students?.length || room?.occupants?.length || 0}</p>
    {room?.floor !== undefined && room?.floor !== null && (
      <p className="text-sm text-gray-600">Floor: {room.floor}</p>
    )}
  </article>
)

export default RoomCard
