export const getDashboardPath = (role) => {
  const map = {
    admin: '/admin/dashboard',
    warden: '/warden/dashboard',
    student: '/student/dashboard',
  }
  return map[role] || '/'
}

export const roleFriendlyName = (role) => {
  const map = {
    admin: 'Admin',
    warden: 'Warden',
    student: 'Student',
  }
  return map[role] || 'User'
}
