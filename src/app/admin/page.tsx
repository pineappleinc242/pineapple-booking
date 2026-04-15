import { redirect } from 'next/navigation'

export default function AdminPage() {
  // Automatically redirect /admin to the bookings dashboard
  redirect('/admin/bookings')
}
