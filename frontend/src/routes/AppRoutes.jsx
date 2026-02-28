import { Routes, Route } from 'react-router-dom'
import Landing from '../pages/Landing'
import Login from '../pages/Login'
import Register from '../pages/Register'
import Developers from '../pages/Developers'
import DashboardLayout from '../layouts/DashboardLayout'
import ProtectedRoute from './ProtectedRoute'
import RoleRoute from './RoleRoute'
import AdminDashboard from '../pages/admin/AdminDashboard'
import RoomsPage from '../pages/admin/RoomsPage'
import StudentsPage from '../pages/admin/StudentsPage'
import WardensPage from '../pages/admin/WardensPage'
import ComplaintsPage from '../pages/admin/ComplaintsPage'
import NoticesPage from '../pages/admin/NoticesPage'
import AdminMenuPage from '../pages/admin/MenuPage'
import ApprovalsPage from '../pages/admin/ApprovalsPage'
import WardenDashboard from '../pages/warden/WardenDashboard'
import MarkAttendancePage from '../pages/warden/MarkAttendancePage'
import WardenComplaintsPage from '../pages/warden/WardenComplaintsPage'
import WardenNoticesPage from '../pages/warden/WardenNoticesPage'
import WardenRoomsPage from '../pages/warden/WardenRoomsPage'
import MenuPage from '../pages/admin/MenuPage'
import StudentDashboard from '../pages/student/StudentDashboard'
import MyAttendancePage from '../pages/student/MyAttendancePage'
import MyComplaintsPage from '../pages/student/MyComplaintsPage'
import MyRoomPage from '../pages/student/MyRoomPage'
import StudentMenuPage from '../pages/student/StudentMenuPage'
import StudentNoticesPage from '../pages/student/StudentNoticesPage'

const AppRoutes = () => (
  <Routes>
    <Route index element={<Landing />} />
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route path="/developers" element={<Developers />} />

    <Route element={<ProtectedRoute />}>
      <Route element={<RoleRoute roles={['admin']} />}>
        <Route element={<DashboardLayout />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/approvals" element={<ApprovalsPage />} />
          <Route path="/admin/rooms" element={<RoomsPage />} />
          <Route path="/admin/students" element={<StudentsPage />} />
          <Route path="/admin/wardens" element={<WardensPage />} />
          <Route path="/admin/complaints" element={<ComplaintsPage />} />
          <Route path="/admin/notices" element={<NoticesPage />} />
          <Route path="/admin/menu" element={<AdminMenuPage />} />
        </Route>
      </Route>

      <Route element={<RoleRoute roles={['warden']} />}>
        <Route element={<DashboardLayout />}>
          <Route path="/warden/dashboard" element={<WardenDashboard />} />
          <Route path="/warden/attendance" element={<MarkAttendancePage />} />
          <Route path="/warden/complaints" element={<WardenComplaintsPage />} />
          <Route path="/warden/notices" element={<WardenNoticesPage />} />
          <Route path="/warden/rooms" element={<WardenRoomsPage />} />
          <Route path="/warden/menu" element={<MenuPage />} />
        </Route>
      </Route>

      <Route element={<RoleRoute roles={['student']} />}>
        <Route element={<DashboardLayout />}>
          <Route path="/student/dashboard" element={<StudentDashboard />} />
          <Route path="/student/attendance" element={<MyAttendancePage />} />
          <Route path="/student/complaints" element={<MyComplaintsPage />} />
          <Route path="/student/room" element={<MyRoomPage />} />
          <Route path="/student/menu" element={<StudentMenuPage />} />
          <Route path="/student/notices" element={<StudentNoticesPage />} />
        </Route>
      </Route>
    </Route>

    <Route path="*" element={<Landing />} />
  </Routes>
)

export default AppRoutes
