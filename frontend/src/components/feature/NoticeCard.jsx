const NoticeCard = ({ title, description, audience, createdAt }) => (
  <article className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
    <div className="flex items-center justify-between text-xs uppercase tracking-wide text-gray-400">
      <span>{audience || 'All'}</span>
      <time>{new Date(createdAt || Date.now()).toLocaleDateString()}</time>
    </div>
    <h4 className="mt-3 text-lg font-semibold text-gray-900">{title}</h4>
    <p className="mt-2 text-sm text-gray-600">{description}</p>
  </article>
)

export default NoticeCard
