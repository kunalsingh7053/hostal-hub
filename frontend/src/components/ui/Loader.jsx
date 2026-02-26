const Loader = ({ label = 'Loading...' }) => (
  <div className="flex min-h-[200px] items-center justify-center">
    <div className="flex items-center gap-3 text-primary">
      <span className="inline-flex h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      <p className="text-sm font-medium text-gray-600">{label}</p>
    </div>
  </div>
)

export default Loader
