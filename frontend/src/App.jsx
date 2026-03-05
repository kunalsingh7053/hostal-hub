import AppRoutes from './routes/AppRoutes'
import { useTheme } from './context/ThemeContext'

const App = () => {
  const { isDark } = useTheme()

  return (
    <div className={`min-h-screen overflow-x-hidden transition-colors ${isDark ? 'bg-slate-950 text-slate-100' : 'bg-gray-50 text-gray-900'}`}>
      <AppRoutes />
    </div>
  )
}

export default App
