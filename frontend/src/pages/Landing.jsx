import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { getDashboardPath, roleFriendlyName } from '../utils/routes'

const navLinks = [
  { label: 'Home', href: '#home' },
  { label: 'Features', href: '#features' },
  { label: 'Roles', href: '#roles' },
  { label: 'Developers', href: '#developers' },
  { label: 'Benefits', href: '#benefits' },
  { label: 'Insights', href: '#insights' },
  { label: 'Stories', href: '#stories' },
  { label: 'FAQ', href: '#faq' },
]

const features = [
  { title: 'Room Management', description: 'Assign rooms, monitor occupancy, and optimize hostel capacity effortlessly.' },
  { title: 'Attendance Tracking', description: 'Real-time attendance logs with warden inputs and student visibility.' },
  { title: 'Complaint System', description: 'Track complaints from submission to resolution with role-based status updates.' },
  { title: 'Mess Menu', description: 'Plan, publish, and review weekly menus with day-wise breakdowns.' },
  { title: 'Notices', description: 'Broadcast important announcements to students and wardens instantly.' },
  { title: 'Role-Based Dashboards', description: 'Personalized insights crafted for admins, wardens, and students.' },
  { title: 'Inventory Planning', description: 'Keep tabs on essentials like bedding, maintenance supplies, and mess stock.' },
  { title: 'Analytics & Trends', description: 'Spot attendance dips, complaint spikes, and room utilization patterns over time.' },
  { title: 'Automated Alerts', description: 'Push SMS/email reminders for dues, inspections, and policy updates without manual work.' },
]

const roles = [
  { title: 'Admin', description: 'Oversee rooms, staff, students, and every operational metric in one place.' },
  { title: 'Warden', description: 'Mark attendance, handle complaints, and manage floors with clarity.' },
  { title: 'Student', description: 'Access rooms, attendance history, mess menus, and notices anytime.' },
]

const steps = [
  { title: 'Invite your team', description: 'Onboard admins, wardens, and students with secure role-based logins.' },
  { title: 'Configure workflows', description: 'Define room blocks, attendance rules, mess menus, and notice templates.' },
  { title: 'Monitor & act', description: 'Track KPIs in real time and automate updates so everyone stays aligned.' },
]

const screenshots = [
  { title: 'Insights Dashboard', description: 'Monitor key KPIs across occupancy, attendance, and complaints.', gradient: 'from-violet-500 to-sky-500' },
  { title: 'Attendance Pulse', description: 'See live attendance based on warden check-ins and student swipes.', gradient: 'from-emerald-500 to-lime-400' },
]

const developers = [
  { name: 'Sejal Singh', enrollment: 'SC23CS301134', image: '/developers/sejal.jpg' },
  { name: 'Shivani Gothi', enrollment: 'SC23CS301139', image: '/developers/shivani.jpg' },
]

const animatedHighlights = [
  { title: 'Live Alerts', description: 'Auto-notify wardens when priority complaints spike.', tag: 'Escalations' },
  { title: 'Smart Rosters', description: 'Rotate wardens based on occupancy load automatically.', tag: 'Scheduling' },
  { title: 'Mess Insights', description: 'Predict inventory shortages from weekly turnout.', tag: 'Dining Ops' },
  { title: 'Energy Saver', description: 'Detect low occupancy floors and dial down utilities.', tag: 'Utilities' },
  { title: 'Guardian Pings', description: 'Share attendance receipts with guardians in one tap.', tag: 'Parent Comms' },
  { title: 'Wellness Pulse', description: 'Spot absentee patterns and send nudges to mentors.', tag: 'Wellbeing' },
]

const highlightMidPoint = Math.ceil(animatedHighlights.length / 2)

const marqueeRows = [
  { direction: 'left', duration: 26, items: animatedHighlights.slice(0, highlightMidPoint) },
  { direction: 'right', duration: 30, items: animatedHighlights.slice(highlightMidPoint) },
]

const useLandingTheme = () => {
  const [theme, setTheme] = useState('light')

  useEffect(() => {
    if (typeof window === 'undefined') return
    const storedTheme = window.localStorage.getItem('hostelHubTheme')
    if (storedTheme === 'dark' || storedTheme === 'light') {
      setTheme(storedTheme)
      return
    }
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark')
    }
  }, [])

  useEffect(() => {
    if (typeof document === 'undefined' || typeof window === 'undefined') return
    document.documentElement.setAttribute('data-theme', theme)
    document.documentElement.classList.toggle('dark', theme === 'dark')
    window.localStorage.setItem('hostelHubTheme', theme)
  }, [theme])

  const toggleTheme = () => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))

  return { theme, toggleTheme }
}

const benefits = [
  { title: 'Centralized Compliance', description: 'Audit-ready logs for check-ins, notices, and escalations in a single trail.' },
  { title: 'Faster Decision Making', description: 'Live KPIs and health indicators help admins unblock teams in minutes.' },
  { title: 'Happier Residents', description: 'Predictive menus, proactive maintenance, and transparent communication.' },
]

const insightMetrics = [
  { label: 'Attendance Reliability', value: '98%', detail: 'Average capture rate across all wards', badgeClasses: 'text-emerald-700 bg-emerald-100' },
  { label: 'Complaint SLA', value: '12h', detail: 'Median resolution window this month', badgeClasses: 'text-amber-800 bg-amber-100' },
  { label: 'Room Utilization', value: '94%', detail: 'Occupancy vs. capacity across hostels', badgeClasses: 'text-indigo-700 bg-indigo-100' },
]

const testimonials = [
  { quote: 'Hostel Hub cut our manual updates by 70%. Wardens now track everything from one pane.', name: 'Dr. Kavita Rao', role: 'Chief Warden, North Block' },
  { quote: 'Complaint loops close faster because students can see status, nudge wardens, and escalate smartly.', name: 'Rishabh Sharma', role: 'Student Council Lead' },
]

const faqs = [
  { question: 'Can we onboard multiple campuses?', answer: 'Yes. Each campus can have its own rooms, wardens, and notice boards while sharing a parent admin view.' },
  { question: 'Does it integrate with biometric devices?', answer: 'The attendance module exposes APIs/webhooks so you can sync data from RFID, biometric, or QR-based systems.' },
  { question: 'How secure are student records?', answer: 'Data is encrypted at rest and in transit. Role-based access ensures wardens only see their assigned blocks.' },
]

const transitionBase = { duration: 0.75, ease: 'easeOut' }

const fadeDown = {
  hidden: { opacity: 0, y: -24 },
  visible: { opacity: 1, y: 0, transition: transitionBase },
}

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: transitionBase },
}

const fadeLeft = {
  hidden: { opacity: 0, x: -40 },
  visible: { opacity: 1, x: 0, transition: transitionBase },
}

const fadeRight = {
  hidden: { opacity: 0, x: 40 },
  visible: { opacity: 1, x: 0, transition: transitionBase },
}

const staggerParent = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
}

const LandingNavbar = ({ theme, toggleTheme }) => {
  const [open, setOpen] = useState(false)
  const [hasShadow, setHasShadow] = useState(false)
  const { isAuthenticated, user, role, logout } = useAuth()

  useEffect(() => {
    const onScroll = () => {
      setHasShadow(window.scrollY > 12)
    }
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const isDark = theme === 'dark'
  const dashboardPath = role ? getDashboardPath(role) : '/login'
  const roleLabel = role ? roleFriendlyName(role) : 'Member'
  const getAnchorHref = (href) => (href.startsWith('#') ? `/${href}` : href)
  const renderThemeIcon = (className = 'h-5 w-5') =>
    isDark ? (
      <svg
        aria-hidden="true"
        className={className}
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
        viewBox="0 0 24 24"
      >
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2m0 16v2m10-10h-2M4 12H2m15.364-7.364-1.414 1.414M8.05 16.95l-1.414 1.414m0-11.314 1.414 1.414m9.9 9.9 1.414 1.414" />
      </svg>
    ) : (
      <svg aria-hidden="true" className={className} fill="currentColor" viewBox="0 0 24 24">
        <path d="M21 12.79A9 9 0 0 1 11.21 3 7 7 0 1 0 15 21.79 9 9 0 0 1 21 12.79z" />
      </svg>
    )

  return (
    <motion.header
      variants={fadeDown}
      initial="hidden"
      animate="visible"
      className={`sticky top-0 z-50 border-b backdrop-blur transition-shadow ${
        isDark ? 'border-white/10 bg-slate-900/90 text-white' : 'border-white/10 bg-white/90'
      } ${hasShadow ? 'shadow-lg shadow-black/20' : ''}`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <a href="#home" className={`text-2xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Hostel <span className="text-primary">Hub</span>
        </a>
        <nav className={`hidden items-center gap-6 text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'} lg:flex`}>
          {navLinks.map((link) => (
            <a key={link.label} href={getAnchorHref(link.href)} className={`transition ${isDark ? 'hover:text-white' : 'hover:text-gray-900'}`}>
              {link.label}
            </a>
          ))}
        </nav>
        <div className="hidden items-center gap-3 lg:flex">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle color theme"
            className={`inline-flex h-10 w-10 items-center justify-center rounded-full border text-sm font-semibold transition ${
              isDark ? 'border-white/20 bg-white/10 text-amber-200 hover:bg-white/20' : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            {renderThemeIcon()}
          </button>
          {isAuthenticated ? (
            <>
              <Link
                to={dashboardPath}
                className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                  isDark ? 'border-white/20 text-white hover:bg-white/10' : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {user?.name || 'User'} • {roleLabel}
              </Link>
              <button
                type="button"
                onClick={logout}
                className="rounded-full bg-red-500/90 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-red-500/40 transition hover:bg-red-500"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm font-semibold text-primary">
                Login
              </Link>
              <Link to="/register" className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-primary/30">
                Register
              </Link>
            </>
          )}
        </div>
        <button
          type="button"
          className={`inline-flex h-10 w-10 items-center justify-center rounded-full lg:hidden ${isDark ? 'bg-white/10 text-white' : 'bg-gray-100 text-gray-900'}`}
          onClick={() => setOpen((prev) => !prev)}
          aria-label="Toggle menu"
        >
          <span className="relative block h-4 w-5">
            <span className={`absolute left-0 block h-0.5 w-full transition ${isDark ? 'bg-white' : 'bg-gray-900'} ${open ? 'top-2 rotate-45' : 'top-0'}`} />
            <span className={`absolute left-0 block h-0.5 w-full transition ${isDark ? 'bg-white' : 'bg-gray-900'} ${open ? 'opacity-0' : 'top-2'}`} />
            <span className={`absolute left-0 block h-0.5 w-full transition ${isDark ? 'bg-white' : 'bg-gray-900'} ${open ? 'top-2 -rotate-45' : 'top-4'}`} />
          </span>
        </button>
      </div>
      {open && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          transition={transitionBase}
          className={`border-t px-4 pb-4 lg:hidden ${isDark ? 'border-white/10 bg-slate-900 text-white' : 'border-gray-100 bg-white'}`}
        >
          <nav className={`flex flex-col gap-3 text-sm font-medium ${isDark ? 'text-white/80' : 'text-gray-700'}`}>
            {navLinks.map((link) => (
              <a key={link.label} href={getAnchorHref(link.href)} onClick={() => setOpen(false)}>
                {link.label}
              </a>
            ))}
            <button
              type="button"
              onClick={() => {
                toggleTheme()
              }}
              className={`mt-2 rounded-2xl border px-4 py-3 text-left text-sm font-semibold transition ${
                isDark ? 'border-white/15 bg-white/5 text-white hover:bg-white/10' : 'border-gray-200 bg-white text-gray-800 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <span>{isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}</span>
                {renderThemeIcon('h-4 w-4')}
              </div>
            </button>
            <div className="mt-3 flex flex-col gap-2">
              {isAuthenticated ? (
                <>
                  <Link
                    to={dashboardPath}
                    onClick={() => setOpen(false)}
                    className={`rounded-2xl border px-4 py-3 text-center text-sm font-semibold transition ${
                      isDark ? 'border-white/15 text-white/90 hover:bg-white/10' : 'border-gray-200 text-gray-800 hover:bg-gray-50'
                    }`}
                  >
                    {user?.name || 'User'} • {roleLabel}
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      setOpen(false)
                      logout()
                    }}
                    className={`rounded-2xl px-4 py-3 text-center text-sm font-semibold transition ${
                      isDark ? 'bg-red-500/90 text-white hover:bg-red-500' : 'bg-red-500 text-white hover:bg-red-600'
                    }`}
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className={`rounded-full border px-4 py-2 text-center font-semibold transition ${
                      isDark ? 'border-white/20 text-white hover:bg-white/10' : 'border-primary/30 text-primary'
                    }`}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="rounded-full bg-primary px-4 py-2 text-center font-semibold text-white"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </nav>
        </motion.div>
      )}
    </motion.header>
  )
}

const Landing = () => {
  const { theme, toggleTheme } = useLandingTheme()
  const isDark = theme === 'dark'
  const mutedText = isDark ? 'text-gray-300' : 'text-gray-600'
  const strongText = isDark ? 'text-white' : 'text-gray-900'
  const cardSurface = isDark ? 'border-white/10 bg-slate-900/70 text-white' : 'border-gray-100 bg-white text-gray-900'
  const softCardSurface = isDark ? 'border-white/10 bg-slate-900/60 text-white' : 'border-gray-100 bg-gradient-to-br from-white to-slate-50 text-gray-900'

  return (
    <div className={`min-h-screen bg-gradient-to-b transition-colors duration-300 ${
      isDark ? 'from-slate-950 via-slate-900 to-slate-900 text-white' : 'from-white via-slate-50 to-gray-100 text-gray-900'
    }`}>
      <LandingNavbar theme={theme} toggleTheme={toggleTheme} />
      <main className="mx-auto flex max-w-6xl flex-col gap-20 px-4 py-16">
        <section id="home" className="grid gap-12 scroll-mt-32 lg:grid-cols-2 lg:items-center">
        <motion.div variants={fadeLeft} initial="hidden" animate="visible" className="space-y-6">
          <motion.p
            className={`inline-flex items-center gap-2 rounded-full px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] shadow ${
              isDark ? 'bg-white/10 text-white' : 'bg-white/70 text-primary'
            }`}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
          >
            Smart Hostels
          </motion.p>
          <h1 className={`text-4xl font-bold leading-tight sm:text-5xl ${strongText}`}>
            Smart Hostel Management Made Simple
          </h1>
          <p className={`text-lg ${mutedText}`}>
            Manage rooms, track attendance, resolve complaints, publish mess menus, and push notices from a
            single dashboard tailored for administrators, wardens, and students.
          </p>
          <motion.div variants={staggerParent} initial="hidden" animate="visible" className="flex flex-wrap gap-4">
            <motion.div variants={fadeUp}>
              <Link to="/register" className="rounded-full bg-primary px-6 py-3 font-semibold text-white shadow-lg shadow-primary/30">
                Get Started
              </Link>
            </motion.div>
            <motion.div variants={fadeUp}>
              <Link
                to="/login"
                className={`rounded-full border px-6 py-3 font-semibold transition ${
                  isDark ? 'border-white/30 text-white hover:bg-white/10' : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}
              >
                Login
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
        <motion.div variants={fadeRight} initial="hidden" animate="visible" className="relative">
          <motion.div className="absolute -left-10 top-10 h-32 w-32 rounded-full bg-primary/20" animate={{ y: [0, -12, 0], opacity: [0.7, 1, 0.7] }} transition={{ duration: 8, repeat: Infinity }} />
          <motion.div
            className={`relative rounded-3xl p-6 shadow-2xl backdrop-blur ${
              isDark ? 'border-white/10 bg-white/5 text-white' : 'border-white/60 bg-white/80 text-gray-900'
            }`}
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-xs uppercase tracking-[0.4em] ${isDark ? 'text-white/60' : 'text-gray-400'}`}>Occupancy</p>
                <p className="text-3xl font-bold">92%</p>
              </div>
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${isDark ? 'bg-emerald-500/20 text-emerald-200' : 'bg-emerald-100 text-emerald-700'}`}>
                +8% this week
              </span>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {[
                { label: 'Open Complaints', value: '12' },
                { label: 'Attendance Today', value: '458' },
                { label: 'Rooms Available', value: '34' },
                { label: 'Broadcast Notices', value: '5' },
              ].map((card) => (
                <motion.div
                  key={card.label}
                  className={`rounded-2xl border p-4 shadow-sm ${isDark ? 'border-white/10 bg-white/5 text-white' : 'border-gray-100 bg-white/70 text-gray-900'}`}
                  whileHover={{ scale: 1.02 }}
                >
                  <p className={`text-xs ${isDark ? 'text-white/60' : 'text-gray-500'}`}>{card.label}</p>
                  <p className="text-2xl font-semibold">{card.value}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </section>

      <motion.section
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        className="relative overflow-hidden rounded-3xl border border-white/60 bg-slate-900 px-6 py-10 text-white shadow-lg shadow-primary/20"
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-60"
          style={{
            backgroundImage:
              'radial-gradient(circle at 20% 20%, rgba(59,130,246,0.35), transparent 45%), radial-gradient(circle at 80% 0%, rgba(14,165,233,0.25), transparent 55%)',
          }}
        />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_bottom,_rgba(15,118,110,0.25),_transparent_60%)]" />
        <div className="relative grid gap-10 lg:grid-cols-[320px,minmax(0,1fr)] lg:items-center">
          <motion.div variants={fadeLeft} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.4 }} className="space-y-5">
            <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.5em] text-white/60">
              <span className="h-px w-6 bg-white/40" />Automation Pulse
            </p>
            <h2 className="text-3xl font-semibold leading-tight">Automation ideas in perpetual motion</h2>
            <p className="text-sm text-white/70">
              A dual-lane marquee keeps strategy, student wellbeing, and ops hygiene flowing round the clock so every
              warden knows what to optimize next.
            </p>
            <div className="flex flex-wrap gap-6 text-sm text-white/70">
              <div>
                <p className="text-3xl font-bold text-white">+28%</p>
                <p className="mt-1 text-xs uppercase tracking-[0.35em] text-white/50">Faster loops</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-white">11</p>
                <p className="mt-1 text-xs uppercase tracking-[0.35em] text-white/50">Live streams</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-white">24/7</p>
                <p className="mt-1 text-xs uppercase tracking-[0.35em] text-white/50">Signal refresh</p>
              </div>
            </div>
          </motion.div>
          <div className="flex flex-col gap-6">
            {marqueeRows.map((row) => (
              <div key={row.direction} className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-3">
                <motion.div
                  className="flex gap-4"
                  animate={{ x: row.direction === 'left' ? ['0%', '-50%'] : ['-50%', '0%'] }}
                  transition={{ duration: row.duration, ease: 'linear', repeat: Infinity }}
                >
                  {[...row.items, ...row.items].map((item, index) => (
                    <article
                      key={`${item.title}-${row.direction}-${index}`}
                      className="min-w-[260px] rounded-2xl border border-white/10 bg-slate-900/70 p-4 shadow-[0_20px_45px_rgba(8,47,73,0.35)] backdrop-blur"
                    >
                      <div className="flex items-center gap-2 text-[0.7rem] font-semibold uppercase tracking-[0.35em] text-indigo-200/80">
                        <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                        {item.tag}
                      </div>
                      <h3 className="mt-3 text-lg font-semibold text-white">{item.title}</h3>
                      <p className="mt-2 text-sm text-white/70">{item.description}</p>
                    </article>
                  ))}
                </motion.div>
                <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-slate-900 via-slate-900/80 to-transparent" />
                <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-slate-900 via-slate-900/80 to-transparent" />
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      <section id="features" className="space-y-8 scroll-mt-32">
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} className="space-y-2 text-center">
          <p className="text-xs uppercase tracking-[0.4em] text-primary">Features</p>
          <h2 className={`text-3xl font-bold ${strongText}`}>Built for every part of hostel life</h2>
          <p className={mutedText}>Powerful workflows wrapped inside a delightful modern interface.</p>
        </motion.div>
        <motion.div variants={staggerParent} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {features.map((feature) => (
            <motion.article
              key={feature.title}
              variants={fadeUp}
              whileHover={{ y: -8, scale: 1.02, boxShadow: '0 25px 50px -12px rgba(37, 99, 235, 0.2)' }}
              className={`rounded-3xl p-6 shadow-sm ${cardSurface}`}
            >
              <div className="mb-4 inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                {feature.title}
              </div>
              <p className={`text-sm ${mutedText}`}>{feature.description}</p>
            </motion.article>
          ))}
        </motion.div>
      </section>

      <section id="benefits" className="space-y-8 scroll-mt-32">
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} className="space-y-2 text-center">
          <p className="text-xs uppercase tracking-[0.4em] text-primary">Benefits</p>
          <h2 className={`text-3xl font-bold ${strongText}`}>Why leadership teams pick Hostel Hub</h2>
          <p className={mutedText}>It is not just a portal—it is a playbook for reliable operations.</p>
        </motion.div>
        <motion.div variants={staggerParent} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} className="grid gap-6 md:grid-cols-3">
          {benefits.map((benefit) => (
            <motion.article
              key={benefit.title}
              variants={fadeUp}
              className={`rounded-3xl p-6 text-left shadow-sm ${softCardSurface}`}
            >
              <h3 className={`text-xl font-semibold ${strongText}`}>{benefit.title}</h3>
              <p className={`mt-3 text-sm ${mutedText}`}>{benefit.description}</p>
            </motion.article>
          ))}
        </motion.div>
      </section>

      <section id="roles" className="space-y-8 scroll-mt-32">
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} className="space-y-2 text-center">
          <p className="text-xs uppercase tracking-[0.4em] text-primary">Roles</p>
          <h2 className={`text-3xl font-bold ${strongText}`}>Dashboards crafted for every role</h2>
          <p className={mutedText}>Tailored data and actions ensure clarity for admins, wardens, and students.</p>
        </motion.div>
        <motion.div variants={staggerParent} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} className="grid gap-6 md:grid-cols-3">
          {roles.map((role) => (
            <motion.article
              key={role.title}
              variants={fadeUp}
              whileHover={{ scale: 1.03, borderColor: '#2563eb', boxShadow: '0 20px 45px -12px rgba(37, 99, 235, 0.3)' }}
              className={`rounded-3xl p-6 text-center shadow-sm ${cardSurface}`}
            >
              <h3 className={`text-xl font-semibold ${strongText}`}>{role.title}</h3>
              <p className={`mt-3 text-sm ${mutedText}`}>{role.description}</p>
            </motion.article>
          ))}
        </motion.div>
      </section>

      <section id="how-it-works" className="space-y-8 scroll-mt-32">
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} className="space-y-2 text-center">
          <p className="text-xs uppercase tracking-[0.4em] text-primary">How it works</p>
          <h2 className={`text-3xl font-bold ${strongText}`}>From onboarding to daily ops</h2>
          <p className={mutedText}>A guided timeline keeps teams aligned and workflows automated.</p>
        </motion.div>
        <motion.div
          variants={staggerParent}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className={`relative space-y-10 border-l border-dashed border-primary/30 pl-10 ${isDark ? 'text-white' : ''}`}
        >
          <motion.span className="absolute left-[-1px] top-4 w-0.5 bg-primary" initial={{ height: 0 }} whileInView={{ height: '90%' }} viewport={{ once: true }} transition={{ duration: 0.9, ease: 'easeOut' }} />
          {steps.map((step, index) => (
            <motion.article key={step.title} variants={fadeUp} className={`relative flex flex-col gap-3 rounded-3xl p-6 shadow-sm ${cardSurface}`}>
              <span className="absolute -left-[38px] flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-semibold text-white">
                {index + 1}
              </span>
              <h3 className={`text-lg font-semibold ${strongText}`}>{step.title}</h3>
              <p className={`text-sm ${mutedText}`}>{step.description}</p>
            </motion.article>
          ))}
        </motion.div>
      </section>

      <section id="insights" className="space-y-8 scroll-mt-32">
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} className="space-y-2 text-center">
          <p className="text-xs uppercase tracking-[0.4em] text-primary">Insights</p>
          <h2 className={`text-3xl font-bold ${strongText}`}>Operational health at a glance</h2>
          <p className={mutedText}>Boards refresh every few seconds so leadership never flies blind.</p>
        </motion.div>
        <motion.div variants={staggerParent} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} className="grid gap-6 md:grid-cols-3">
          {insightMetrics.map((metric) => (
            <motion.article
              key={metric.label}
              variants={fadeUp}
              className={`rounded-3xl p-6 shadow-sm ${cardSurface}`}
            >
              <p className={`text-xs uppercase tracking-[0.4em] ${isDark ? 'text-white/60' : 'text-gray-400'}`}>{metric.label}</p>
              <p className={`mt-3 text-4xl font-bold ${strongText}`}>{metric.value}</p>
              <p className={`mt-2 text-sm ${mutedText}`}>{metric.detail}</p>
              <span className={`mt-4 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${isDark ? 'bg-white/10 text-white' : metric.badgeClasses}`}>
                Live
              </span>
            </motion.article>
          ))}
        </motion.div>
      </section>

      <section id="screens" className="space-y-8 scroll-mt-32">
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} className="space-y-2 text-center">
          <p className="text-xs uppercase tracking-[0.4em] text-primary">Screenshots</p>
          <h2 className={`text-3xl font-bold ${strongText}`}>Visualize the dashboards</h2>
          <p className={mutedText}>Zoomed-in previews highlight clarity and hierarchy.</p>
        </motion.div>
        <motion.div variants={staggerParent} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} className="grid gap-6 md:grid-cols-2">
          {screenshots.map((shot) => (
            <motion.article
              key={shot.title}
              variants={fadeUp}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              className={`overflow-hidden rounded-3xl shadow-lg ${isDark ? 'border border-white/10 bg-slate-900/70' : 'border border-gray-100 bg-white'}`}
            >
              <motion.div className={`h-60 bg-gradient-to-br ${shot.gradient} p-6`} initial={{ scale: 0.95 }} whileInView={{ scale: 1 }} transition={{ duration: 0.8, ease: 'easeOut' }}>
                <motion.div className="h-full w-full rounded-2xl bg-white/15" whileHover={{ scale: 1.05 }}>
                  <div className="flex h-full flex-col justify-between p-4 text-white">
                    <div>
                      <p className="text-sm uppercase tracking-[0.4em] text-white/70">Preview</p>
                      <h3 className="text-2xl font-semibold">{shot.title}</h3>
                    </div>
                    <p className="text-sm text-white/80">{shot.description}</p>
                  </div>
                </motion.div>
              </motion.div>
            </motion.article>
          ))}
        </motion.div>
      </section>

      <section id="stories" className="space-y-8 scroll-mt-32">
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} className="space-y-2 text-center">
          <p className="text-xs uppercase tracking-[0.4em] text-primary">Stories</p>
          <h2 className={`text-3xl font-bold ${strongText}`}>Teams already reduced chaos</h2>
          <p className={mutedText}>Anecdotes from admins and students using Hostel Hub daily.</p>
        </motion.div>
        <motion.div variants={staggerParent} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} className="grid gap-6 md:grid-cols-2">
          {testimonials.map((item) => (
            <motion.article
              key={item.name}
              variants={fadeUp}
              className={`rounded-3xl p-6 text-left shadow-md ${cardSurface}`}
            >
              <p className={`text-lg font-medium ${strongText}`}>“{item.quote}”</p>
              <div className={`mt-4 text-sm ${mutedText}`}>
                <p className={`font-semibold ${strongText}`}>{item.name}</p>
                <p>{item.role}</p>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </section>

      <section id="developers" className="space-y-8 scroll-mt-32">
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} className="space-y-2 text-center">
          <p className="text-xs uppercase tracking-[0.4em] text-primary">Developers</p>
          <h2 className={`text-3xl font-bold ${strongText}`}>Meet the minds behind Hostel Hub</h2>
        </motion.div>
        <motion.div variants={staggerParent} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} className="grid gap-6 md:grid-cols-2">
          {developers.map((dev) => (
            <motion.article
              key={dev.enrollment}
              variants={fadeUp}
              whileHover={{ scale: 1.02, rotate: 1 }}
              className={`flex items-center gap-4 rounded-3xl p-6 shadow-sm ${cardSurface}`}
            >
              <motion.div className="h-20 w-20 overflow-hidden rounded-full border-4 border-white shadow" animate={{ y: [0, -6, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}>
                <img
                  src={dev.image}
                  alt={dev.name}
                  className="h-full w-full object-cover"
                  onError={(event) => {
                    event.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(dev.name)}`
                  }}
                />
              </motion.div>
              <div>
                <h3 className={`text-lg font-semibold ${strongText}`}>{dev.name}</h3>
                <p className={`text-sm ${mutedText}`}>{dev.enrollment}</p>
              </div>
            </motion.article>
          ))}
        </motion.div>
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} className="text-center">
          <Link to="/developers" className="inline-flex items-center rounded-full border border-primary/20 px-6 py-3 text-sm font-semibold text-primary">
            View Developers
          </Link>
        </motion.div>
      </section>

      <section id="faq" className="space-y-8 scroll-mt-32">
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} className="space-y-2 text-center">
          <p className="text-xs uppercase tracking-[0.4em] text-primary">FAQ</p>
          <h2 className={`text-3xl font-bold ${strongText}`}>What leaders ask before onboarding</h2>
          <p className={mutedText}>Still curious? Book a walkthrough with our team.</p>
        </motion.div>
        <motion.div variants={staggerParent} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} className="space-y-4">
          {faqs.map((faq) => (
            <motion.details
              key={faq.question}
              variants={fadeUp}
              className={`group rounded-3xl p-5 shadow-sm ${cardSurface}`}
            >
              <summary className={`cursor-pointer list-none text-left text-lg font-semibold ${strongText}`}>
                {faq.question}
              </summary>
              <p className={`mt-3 text-sm ${mutedText}`}>{faq.answer}</p>
            </motion.details>
          ))}
        </motion.div>
      </section>

      <motion.section
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary via-indigo-500 to-sky-500 p-8 text-center text-white animate-gradient-flow"
      >
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at top, white, transparent 45%)' }} />
        <motion.div className="relative space-y-6" variants={fadeUp}>
          <p className="text-sm uppercase tracking-[0.5em] text-white/80">Take action</p>
          <h2 className="text-3xl font-bold">Ready to Simplify Hostel Management?</h2>
          <div className="flex flex-wrap justify-center gap-4">
            <motion.div whileHover={{ scale: 1.03 }} animate={{ scale: [1, 1.02, 1] }} transition={{ duration: 2.5, repeat: Infinity }}>
              <Link to="/register" className="rounded-full bg-white px-6 py-3 font-semibold text-primary">
                Get Started
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.03 }} animate={{ scale: [1, 1.02, 1] }} transition={{ duration: 2.8, repeat: Infinity, delay: 0.2 }}>
              <Link to="/login" className="rounded-full border border-white/60 px-6 py-3 font-semibold text-white">
                Login
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </motion.section>
    </main>

    <motion.footer
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      className={`border-t ${isDark ? 'border-white/10 bg-slate-900/80 text-white/80' : 'border-gray-200 bg-white text-gray-600'}`}
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 text-center text-sm md:flex-row md:items-center md:justify-between">
        <div>
          <p className={`text-lg font-semibold ${strongText}`}>Hostel Hub</p>
          <p>© 2026 Hostel Hub. All rights reserved.</p>
        </div>
        <div className="flex flex-wrap justify-center gap-4">
          {['Home', 'Features', 'Roles', 'Developers'].map((link) => (
            <a
              key={link}
              href={`/#${link.toLowerCase().replace(/\s+/g, '-')}`}
              className={`transition ${isDark ? 'hover:text-white' : 'hover:text-gray-900'}`}
            >
              {link}
            </a>
          ))}
          <Link to="/login" className={`transition ${isDark ? 'hover:text-white' : 'hover:text-gray-900'}`}>
            Login
          </Link>
          <Link to="/register" className={`transition ${isDark ? 'hover:text-white' : 'hover:text-gray-900'}`}>
            Register
          </Link>
        </div>
      </div>
    </motion.footer>
    </div>
  )
}

export default Landing
