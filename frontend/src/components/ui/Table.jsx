const Table = ({ columns = [], rows = [], emptyLabel = 'Nothing to show' }) => (
  <div className="overflow-x-auto">
    <div className="min-w-full overflow-hidden rounded-2xl border border-gray-100 shadow-sm">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column) => (
              <th
                key={column.accessor}
                className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500"
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 bg-white">
          {rows.length === 0 && (
            <tr>
              <td colSpan={columns.length} className="px-4 py-6 text-center text-sm text-gray-500">
                {emptyLabel}
              </td>
            </tr>
          )}
          {rows.map((row) => (
            <tr key={row.id || row._id} className="hover:bg-gray-50">
              {columns.map((column) => (
                <td key={column.accessor} className="px-4 py-3 text-sm text-gray-700">
                  {typeof column.cell === 'function' ? column.cell(row) : row[column.accessor]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
)

export default Table
