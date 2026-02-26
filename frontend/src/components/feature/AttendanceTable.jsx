import Table from '../ui/Table'

const AttendanceTable = ({ records = [], allowActions = false, onToggle }) => {
  const columns = [
    { header: 'Date', accessor: 'date' },
    { header: 'Student', accessor: 'studentName' },
    { header: 'Roll', accessor: 'rollNumber' },
    { header: 'Status', accessor: 'status' },
  ]

  if (allowActions) {
    columns.push({
      header: 'Action',
      accessor: 'action',
      cell: (row) => (
        <button
          onClick={() => onToggle?.(row)}
          className="text-sm font-semibold text-primary"
        >
          Mark {row.status === 'Present' ? 'Absent' : 'Present'}
        </button>
      ),
    })
  }

  return <Table columns={columns} rows={records} emptyLabel="No attendance records yet" />
}

export default AttendanceTable
