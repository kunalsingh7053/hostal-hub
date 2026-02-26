import Button from './Button'

const Modal = ({ open, title, description, children, onClose, actions }) => {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
        {(title || description) && (
          <header className="mb-4 space-y-1">
            {title && <h3 className="text-xl font-semibold text-gray-900">{title}</h3>}
            {description && <p className="text-sm text-gray-500">{description}</p>}
          </header>
        )}
        <div className="space-y-4">{children}</div>
        <footer className="mt-6 flex justify-end gap-3">
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
          {actions}
        </footer>
      </div>
    </div>
  )
}

export default Modal
