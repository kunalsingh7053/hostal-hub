const NoticeCard = ({ title, description, message, audience, target, block, floor, createdAt, onDelete }) => (
  <article className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
    <div className="flex items-center justify-between text-xs uppercase tracking-wide text-gray-400">
      <span>{audience || target || 'All'}</span>
      <time>{new Date(createdAt || Date.now()).toLocaleDateString()}</time>
    </div>
    <h4 className="mt-3 text-lg font-semibold text-gray-900">{title}</h4>
    <p className="mt-2 text-sm text-gray-600">{description || message}</p>
    {(target === 'block' || target === 'floor') && (
      <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
        {target === 'block' && block ? `Block: ${block}` : null}
        {target === 'floor' && (floor || floor === 0) ? `Floor: ${floor}` : null}
      </p>
    )}
    {onDelete && (
      <div className="mt-4 flex justify-end">
        <button
          type="button"
          className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-50"
          onClick={onDelete}
        >
          Delete
        </button>
      </div>
    )}
  </article>
)

export default NoticeCard
