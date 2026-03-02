import clsx from 'clsx'

const Card = ({ title, description, children, className, actions }) => (
  <section
    className={clsx(
      'rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100 transition-colors dark:bg-slate-900 dark:ring-slate-800 dark:shadow-slate-900/40',
      className,
    )}
  >
    {(title || description || actions) && (
      <header className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          {title && <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100">{title}</h3>}
          {description && <p className="text-sm text-gray-500 dark:text-slate-400">{description}</p>}
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </header>
    )}
    {children}
  </section>
)

export default Card
