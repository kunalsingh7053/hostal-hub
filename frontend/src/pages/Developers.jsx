import Navbar from '../components/Navbar'

const developers = [
  {
    name: 'Sejal Singh',
    enrollment: 'SC23CS301134',
    image: 'https://i.pinimg.com/1200x/78/1d/f9/781df9149c96a37ee4c3d0afb9c0f987.jpg',
  },
  {
    name: 'Shivani Gothi',
    enrollment: 'SC23CS301139',
    image: 'https://i.pinimg.com/736x/9f/f5/a2/9ff5a212d50b204a9cfd54c80e68dd35.jpg',
  },
]

const Developers = () => (
  <div className="min-h-screen bg-gray-50 text-gray-900 transition-colors dark:bg-slate-950 dark:text-slate-100">
    <Navbar />
    <section className="mx-auto flex max-w-4xl flex-col items-center gap-10 px-4 py-16 text-center">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">Meet the builders</p>
        <h1 className="mt-4 text-4xl font-bold text-gray-900 dark:text-white">Developers</h1>
      </div>
      <div className="grid w-full gap-8 sm:grid-cols-2">
        {developers.map((dev) => (
          <article
            key={dev.enrollment}
            className="group rounded-3xl bg-white p-8 shadow-sm ring-1 ring-gray-100 transition hover:-translate-y-1 hover:shadow-xl dark:bg-slate-900 dark:ring-slate-800 dark:shadow-slate-900/40"
          >
            <div className="mx-auto h-28 w-28 overflow-hidden rounded-full border-4 border-white shadow-xl">
              <img
                src={dev.image}
                alt={dev.name}
                className="h-full w-full object-cover transition group-hover:scale-110"
                onError={(event) => {
                  event.currentTarget.src = 'https://ui-avatars.com/api/?name=' + dev.name.replace(' ', '+')
                }}
              />
            </div>
            <h3 className="mt-6 text-xl font-semibold text-gray-900 dark:text-slate-100">{dev.name}</h3>
            <p className="text-sm text-gray-500 dark:text-slate-400">{dev.enrollment}</p>
          </article>
        ))}
      </div>
    </section>
  </div>
)

export default Developers
