const Input = ({ label, helperText, error, className = '', ...props }) => (
  <label className={`flex flex-col gap-1 text-sm text-gray-700 ${className}`}>
    {label && <span className="font-medium">{label}</span>}
    <input
      className={`w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-gray-900 shadow-sm transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 ${error ? 'border-rose-400' : ''}`}
      {...props}
    />
    {(helperText || error) && (
      <span className={`text-xs ${error ? 'text-rose-500' : 'text-gray-500'}`}>
        {error || helperText}
      </span>
    )}
  </label>
)

export default Input
