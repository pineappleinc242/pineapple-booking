'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/Button'
import { Input } from '@/components/Input'
import { Select } from '@/components/Select'
import { Badge } from '@/components/Badge'
import { Card } from '@/components/Card'
import Link from 'next/link'

interface Booking {
  id: string
  full_name: string
  email: string
  phone?: string
  service: string
  booking_date: string
  booking_time: string
  notes?: string
  created_at: string
  status: 'PENDING' | 'APPROVED' | 'CANCELLED' | 'RESCHEDULED'
  rescheduled_from_date?: string
  rescheduled_from_time?: string
  updated_at: string
}

async function getBookings(): Promise<Booking[]> {
  try {
    const response = await fetch('/api/admin/bookings')
    if (!response.ok) {
      console.error('Failed to fetch bookings')
      return []
    }
    const data = await response.json()
    return data.bookings || []
  } catch (err) {
    console.error('Server error:', err)
    return []
  }
}

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [filter, setFilter] = useState<'today' | 'week' | 'all'>('all')
  const [serviceFilter, setServiceFilter] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null)
  const toggleCard = (id: string) => {
    setExpandedCardId(prev => prev === id ? null : id)
  }

  const [rescheduleModal, setRescheduleModal] = useState<{ booking: Booking | null; isOpen: boolean }>({ booking: null, isOpen: false })
  const [rescheduleData, setRescheduleData] = useState({ date: '', time: '' })

  useEffect(() => {
    loadBookings()
  }, [])

  const loadBookings = async () => {
    setLoading(true)
    const data = await getBookings()
    setBookings(data)
    setLoading(false)
  }

  const handleReschedule = async () => {
    if (!rescheduleModal.booking || !rescheduleData.date || !rescheduleData.time) return
    setUpdatingId(rescheduleModal.booking.id)

    try {
      const response = await fetch(`/api/admin/bookings/${rescheduleModal.booking.id}/reschedule`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-token': process.env.NEXT_PUBLIC_ADMIN_TOKEN || ''
        },
        body: JSON.stringify({
          new_date: rescheduleData.date,
          new_time: rescheduleData.time
        })
      })

      if (response.ok) {
        const result = await response.json()
        setBookings(bookings.map(b => 
          b.id === rescheduleModal.booking!.id ? {
            ...b,
            booking_date: rescheduleData.date,
            booking_time: rescheduleData.time,
            status: 'RESCHEDULED',
            rescheduled_from_date: result.old_date,
            rescheduled_from_time: result.old_time,
            updated_at: new Date().toISOString()
          } : b
        ))
        setToast({ message: 'Booking rescheduled successfully', type: 'success' })
        setRescheduleModal({ booking: null, isOpen: false })
        setRescheduleData({ date: '', time: '' })
      } else {
        const error = await response.json()
        setToast({ message: error.error || 'Failed to reschedule booking', type: 'error' })
      }
    } catch (err) {
      console.error('Reschedule error:', err)
      setToast({ message: 'Failed to reschedule booking', type: 'error' })
    }
    setUpdatingId(null)
  }

  const handleStatusUpdate = async (bookingId: string, action: 'approve' | 'cancel') => {
    setUpdatingId(bookingId)
    try {
      const endpoint = action === 'approve' ? 'approve' : 'cancel'
      const response = await fetch(`/api/admin/bookings/${bookingId}/${endpoint}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-token': process.env.NEXT_PUBLIC_ADMIN_TOKEN || ''
        }
      })

      if (response.ok) {
        setBookings(bookings.map(b => 
          b.id === bookingId ? {
            ...b,
            status: action === 'approve' ? 'APPROVED' : 'CANCELLED',
            updated_at: new Date().toISOString()
          } : b
        ))
        setToast({ message: `Booking ${action}d successfully`, type: 'success' })
      } else {
        const error = await response.json()
        setToast({ message: error.error || `Failed to ${action} booking`, type: 'error' })
      }
    } catch (err) {
      console.error(`${action} error:`, err)
      setToast({ message: `Failed to ${action} booking`, type: 'error' })
    } finally {
      setUpdatingId(null)
    }
  }

  const openRescheduleModal = (booking: Booking) => {
    setRescheduleModal({ booking, isOpen: true })
    setRescheduleData({ date: booking.booking_date, time: booking.booking_time })
  }

  const closeRescheduleModal = () => {
    setRescheduleModal({ booking: null, isOpen: false })
    setRescheduleData({ date: '', time: '' })
  }

  const filteredBookings = bookings.filter(booking => {
    const bookingDate = new Date(booking.booking_date)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    if (filter === 'today') {
      if (bookingDate.toDateString() !== today.toDateString()) return false
    } else if (filter === 'week') {
      const weekFromNow = new Date(today)
      weekFromNow.setDate(today.getDate() + 7)
      if (bookingDate < today || bookingDate > weekFromNow) return false
    }

    if (serviceFilter !== 'all' && booking.service !== serviceFilter) return false
    
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase()
      const matchesName = booking.full_name.toLowerCase().includes(searchLower)
      const matchesEmail = booking.email.toLowerCase().includes(searchLower)
      const matchesPhone = booking.phone?.toLowerCase().includes(searchLower)
      if (!matchesName && !matchesEmail && !matchesPhone) return false
    }

    return true
  })

  // Group bookings by status to display pending items first
  const pendingBookings = filteredBookings.filter(b => b.status === 'PENDING')
  const actionedBookings = filteredBookings.filter(b => b.status !== 'PENDING')
  const sortedFilteredBookings = [...pendingBookings, ...actionedBookings]

  const uniqueServices = [...new Set(bookings.map(b => b.service))]
  
  const getStatusDisplay = (status: Booking['status']) => {
    switch (status) {
      case 'APPROVED': return { color: 'bg-green-100 text-green-800 border-green-200', text: 'Approved' }
      case 'PENDING': return { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', text: 'Pending Action' }
      case 'CANCELLED': return { color: 'bg-red-100 text-red-800 border-red-200', text: 'Cancelled' }
      case 'RESCHEDULED': return { color: 'bg-blue-100 text-blue-800 border-blue-200', text: 'Rescheduled' }
      default: return { color: 'bg-gray-100 text-gray-800 border-gray-200', text: status }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-sand/30 flex items-center justify-center">
        <div className="text-center flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-primary font-medium tracking-wide">Securely loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F4E9D8]/50 py-12 px-4 sm:px-6 lg:px-8 font-sans text-primary">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10 lg:flex lg:items-end lg:justify-between">
          <div>
            <h1 className="text-4xl font-extrabold font-heading text-primary mb-3">Booking Control Center</h1>
            <p className="text-lg text-primary/70 font-medium">Manage incoming client shoots, detailed requests, and schedule.</p>
          </div>
          <div className="mt-6 flex flex-wrap gap-4 lg:mt-0">
            <Button asChild variant="outline" className="border-2 border-primary/20 text-primary hover:bg-white shadow-sm rounded-xl px-6 py-2.5">
              <Link href="/admin/availability">Manage Availability</Link>
            </Button>
            <Button asChild variant="outline" className="border-2 border-primary/20 text-primary hover:bg-white shadow-sm rounded-xl px-6 py-2.5">
              <Link href="/">Back to Website</Link>
            </Button>
          </div>
        </div>

        {/* Dashboard Filters */}
        <div className="bg-white rounded-3xl p-8 mb-10 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-xl">🔍</span>
            <h2 className="text-lg font-bold text-primary tracking-wide">Filter & Search</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-2 uppercase tracking-wide">Date Filter</label>
              <Select
                value={filter}
                onChange={(e) => setFilter(e.target.value as any)}
                className="w-full bg-gray-50 border-gray-200 rounded-xl h-12"
              >
                <option value="all">All Dates</option>
                <option value="today">Today&apos;s Bookings</option>
                <option value="week">Next 7 Days</option>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-2 uppercase tracking-wide">Service Type</label>
              <Select
                value={serviceFilter}
                onChange={(e) => setServiceFilter(e.target.value)}
                className="w-full bg-gray-50 border-gray-200 rounded-xl h-12"
              >
                <option value="all">All Services</option>
                {uniqueServices.map(service => (
                  <option key={service} value={service}>{service}</option>
                ))}
              </Select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-2 uppercase tracking-wide">Search Clients</label>
              <Input
                type="text"
                placeholder="Name, email, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-50 border-gray-200 rounded-xl h-12"
              />
            </div>
          </div>
        </div>

        {/* Bookings View */}
        {sortedFilteredBookings.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 text-center shadow-sm border border-gray-100">
            <div className="text-6xl mb-6">📋</div>
            <h3 className="text-2xl font-bold text-primary mb-3">No bookings found</h3>
            <p className="text-lg text-gray-500 max-w-md mx-auto">
              {bookings.length === 0 
                ? "You don't have any bookings yet. Once a client schedules a service, it will appear here." 
                : "No bookings match your current search parameters. Try adjusting your filters above."}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {sortedFilteredBookings.map((booking) => {
              const statusDisplay = getStatusDisplay(booking.status);
              const formattedDate = new Date(booking.booking_date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
              
              return (
                <div key={booking.id} className={`bg-white rounded-3xl overflow-hidden shadow-[0_4px_20px_rgb(0,0,0,0.03)] border transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] ${booking.status === 'PENDING' ? 'border-yellow-200' : 'border-gray-100'}`}>
                  
                  {/* Card Header (Clickable summary) */}
                  <div 
                    onClick={() => toggleCard(booking.id)}
                    className={`px-8 py-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 cursor-pointer transition-colors ${booking.status === 'PENDING' ? 'bg-yellow-50/50 hover:bg-yellow-100/50' : 'bg-gray-50/50 hover:bg-gray-100/50'} ${expandedCardId === booking.id ? 'border-b border-gray-100' : ''}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-14 w-14 rounded-full bg-primary/5 flex items-center justify-center text-primary font-bold text-xl uppercase border border-primary/10">
                        {booking.full_name.charAt(0)}{booking.full_name.split(' ')[1]?.[0]}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-primary flex items-center gap-2">
                          {booking.full_name}
                          {booking.status === 'PENDING' && <span className="inline-block w-2 h-2 rounded-full bg-yellow-500 animate-pulse"></span>}
                        </h3>
                        <p className="text-sm font-medium text-gray-500">
                          {booking.service} • {formattedDate} at {booking.booking_time}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 w-full sm:w-auto mt-2 sm:mt-0 justify-between sm:justify-end">
                      <span className={`px-4 py-1.5 rounded-full text-sm font-bold tracking-wider uppercase border ${statusDisplay.color}`}>
                        {statusDisplay.text}
                      </span>
                      <div className="text-gray-400 bg-white p-2 rounded-full border border-gray-200 shadow-sm">
                        <svg className={`w-5 h-5 transform transition-transform duration-300 ${expandedCardId === booking.id ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Expandable Card Body */}
                  <div className={`transition-all duration-300 ease-in-out origin-top ${expandedCardId === booking.id ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                    <div className="p-8">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* Booking Details */}
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3 border-b border-gray-100 pb-2">Scheduling</h4>
                        <div className="space-y-3">
                          <div>
                            <p className="text-sm text-gray-500">Service</p>
                            <p className="font-semibold text-primary">{booking.service}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Date</p>
                            <p className="font-semibold text-primary">{formattedDate}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Time</p>
                            <p className="font-semibold text-primary">{booking.booking_time}</p>
                          </div>
                        </div>
                      </div>

                      {/* Contact Info */}
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3 border-b border-gray-100 pb-2">Client Contact</h4>
                        <div className="space-y-3">
                          <div>
                            <p className="text-sm text-gray-500">Email Address</p>
                            <a href={`mailto:${booking.email}`} className="font-semibold text-[#C99A2D] hover:underline underline-offset-2">{booking.email}</a>
                          </div>
                          {booking.phone && (
                            <div>
                              <p className="text-sm text-gray-500">Phone</p>
                              <a href={`tel:${booking.phone}`} className="font-semibold text-primary hover:text-gray-600 transition-colors">{booking.phone}</a>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Notes / Message */}
                      <div className="lg:col-span-1">
                        <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3 border-b border-gray-100 pb-2">Client Notes</h4>
                        <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100 h-[calc(100%-2.5rem)]">
                          {booking.notes ? (
                            <p className="text-sm text-gray-700 leading-relaxed italic">&quot;{booking.notes}&quot;</p>
                          ) : (
                            <p className="text-sm text-gray-400 italic">No additional notes provided by client.</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card Actions */}
                  <div className="px-8 py-5 bg-gray-50 flex flex-wrap justify-end gap-3 border-t border-gray-100">
                    {booking.status === 'PENDING' && (
                      <>
                        <Button 
                          variant="danger" 
                          className="bg-red-50 hover:bg-red-100 text-red-700 hover:text-red-800 border-0 rounded-xl px-6"
                          onClick={() => handleStatusUpdate(booking.id, 'cancel')}
                          disabled={updatingId === booking.id}
                        >
                          Decline Shoot
                        </Button>
                        <Button 
                          className="bg-primary hover:bg-[#222222] text-white rounded-xl px-8 shadow-md hover:shadow-xl transition-all"
                          onClick={() => handleStatusUpdate(booking.id, 'approve')}
                          disabled={updatingId === booking.id}
                        >
                          {updatingId === booking.id ? 'Processing...' : 'Approve Booking'}
                        </Button>
                      </>
                    )}
                    
                    {booking.status === 'APPROVED' && (
                      <>
                        <Button 
                          variant="outline" 
                          className="border-gray-200 text-gray-700 rounded-xl px-6"
                          onClick={() => openRescheduleModal(booking)}
                          disabled={updatingId === booking.id}
                        >
                          Reschedule
                        </Button>
                        <Button 
                          variant="danger" 
                          className="bg-red-50 hover:bg-red-100 text-red-700 hover:text-red-800 border-0 rounded-xl px-6"
                          onClick={() => handleStatusUpdate(booking.id, 'cancel')}
                          disabled={updatingId === booking.id}
                        >
                          Cancel Booking
                        </Button>
                      </>
                    )}

                    {(booking.status === 'CANCELLED' || booking.status === 'RESCHEDULED') && (
                      <span className="text-sm font-medium text-gray-400 px-4 py-2">No further actions required</span>
                    )}
                  </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Modern Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-fade-in-up">
          <div className={`px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 backdrop-blur-md border ${
            toast.type === 'success' 
              ? 'bg-green-900/90 text-white border-green-800' 
              : 'bg-red-900/90 text-white border-red-800'
          }`}>
            <span className="text-xl">{toast.type === 'success' ? '✓' : '⚠️'}</span>
            <span className="font-medium tracking-wide">{toast.message}</span>
            <button
              onClick={() => setToast(null)}
              className="ml-4 text-white/50 hover:text-white transition-colors text-xl font-light"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Modernized Reschedule Modal */}
      {rescheduleModal.isOpen && rescheduleModal.booking && (
        <div className="fixed inset-0 bg-primary/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border border-gray-100 animate-scale-in">
            <h3 className="text-2xl font-bold font-heading text-primary mb-2">Reschedule Shoot</h3>
            <p className="text-gray-500 mb-8 text-sm">
              Select a new date and time for {rescheduleModal.booking.full_name}&apos;s session.
            </p>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold uppercase tracking-wide text-gray-600 mb-2">New Date</label>
                <Input
                  type="date"
                  value={rescheduleData.date}
                  onChange={(e) => setRescheduleData(prev => ({ ...prev, date: e.target.value }))}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full bg-gray-50 rounded-xl h-12"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold uppercase tracking-wide text-gray-600 mb-2">New Time</label>
                <Select
                  value={rescheduleData.time}
                  onChange={(e) => setRescheduleData(prev => ({ ...prev, time: e.target.value }))}
                  className="w-full bg-gray-50 rounded-xl h-12"
                >
                  <option value="">Select available time...</option>
                  {['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'].map(time => (
                    <option key={time} value={time}>{parseInt(time.split(':')[0]) > 12 ? parseInt(time.split(':')[0]) - 12 : parseInt(time.split(':')[0])}:00 {parseInt(time.split(':')[0]) >= 12 ? 'PM' : 'AM'}</option>
                  ))}
                </Select>
              </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-10">
              <Button variant="outline" onClick={closeRescheduleModal} className="rounded-xl border-gray-200">
                Cancel
              </Button>
              <Button
                onClick={handleReschedule}
                className="rounded-xl bg-primary text-white"
                disabled={updatingId === rescheduleModal.booking.id || !rescheduleData.date || !rescheduleData.time}
              >
                {updatingId === rescheduleModal.booking.id ? 'Updating...' : 'Confirm Reschedule'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
