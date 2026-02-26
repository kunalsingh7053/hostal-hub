import Navbar from '../components/Navbar'

const developers = [
  {
    name: 'Sejal Singh',
    enrollment: 'SC23CS301134',
    image: '/developers/sejal.jpg',
  },
  {
    name: 'Shivani Gothi',
    enrollment: 'SC23CS301139',
    image: '/developers/shivani.jpg',
  },
]

const Developers = () => (
  <div className="min-h-screen bg-gray-50">
    <Navbar />
    <section className="mx-auto flex max-w-4xl flex-col items-center gap-10 px-4 py-16 text-center">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">Meet the builders</p>
        <h1 className="mt-4 text-4xl font-bold text-gray-900">Developers</h1>
      </div>
      <div className="grid w-full gap-8 sm:grid-cols-2">
        {developers.map((dev) => (
          <article
            key={dev.enrollment}
            className="group rounded-3xl bg-white p-8 shadow-sm ring-1 ring-gray-100 transition hover:-translate-y-1 hover:shadow-xl"
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
            <h3 className="mt-6 text-xl font-semibold text-gray-900">{dev.name}</h3>
            <p className="text-sm text-gray-500">{dev.enrollment}</p>
          </article>
        ))}
      </div>
    </section>
  </div>
)

export default Developers
