const MenuTable = ({ menu = [], onDelete }) => (
  <div className="overflow-x-auto">
    <div className="min-w-full overflow-hidden rounded-2xl border border-gray-100 shadow-sm">
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-3 py-2 text-left text-[11px] font-semibold uppercase tracking-wide text-gray-500 sm:px-4 sm:py-3 sm:text-xs">Day</th>
            <th className="px-3 py-2 text-left text-[11px] font-semibold uppercase tracking-wide text-gray-500 sm:px-4 sm:py-3 sm:text-xs">Breakfast</th>
            <th className="px-3 py-2 text-left text-[11px] font-semibold uppercase tracking-wide text-gray-500 sm:px-4 sm:py-3 sm:text-xs">Lunch</th>
            <th className="px-3 py-2 text-left text-[11px] font-semibold uppercase tracking-wide text-gray-500 sm:px-4 sm:py-3 sm:text-xs">Snacks</th>
            <th className="px-3 py-2 text-left text-[11px] font-semibold uppercase tracking-wide text-gray-500 sm:px-4 sm:py-3 sm:text-xs">Dinner</th>
            {onDelete && (
              <th className="px-3 py-2 text-left text-[11px] font-semibold uppercase tracking-wide text-gray-500 sm:px-4 sm:py-3 sm:text-xs">Actions</th>
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 bg-white text-xs text-gray-700 sm:text-sm">
          {menu.length === 0 && (
            <tr>
              <td colSpan={onDelete ? 6 : 5} className="px-4 py-6 text-center text-gray-500">
                Menu not published yet
              </td>
            </tr>
          )}
          {menu.map((day) => (
            <tr key={day._id || day.day}>
              <td className="px-3 py-2 font-semibold capitalize sm:px-4 sm:py-3">{day.day}</td>
              <td className="px-3 py-2 sm:px-4 sm:py-3">{day.breakfast}</td>
              <td className="px-3 py-2 sm:px-4 sm:py-3">{day.lunch}</td>
              <td className="px-3 py-2 sm:px-4 sm:py-3">{day.snacks}</td>
              <td className="px-3 py-2 sm:px-4 sm:py-3">{day.dinner}</td>
              {onDelete && (
                <td className="px-3 py-2 sm:px-4 sm:py-3">
                  <button
                    type="button"
                    className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-50"
                    onClick={() => onDelete(day)}
                  >
                    Delete
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
)

export default MenuTable
