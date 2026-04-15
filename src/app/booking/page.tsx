'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/Button'
import { Input } from '@/components/Input'
import { Select } from '@/components/Select'
import { Textarea } from '@/components/Textarea'
import { Card } from '@/components/Card'
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock } from 'lucide-react'

export default function Booking() {
  const [step, setStep] = useState(1) // Step 1: Calendar & Time, Step 2: Form Details
  
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    phone: '',
    company_name: '',
    service: '',
    booking_date: '',
    booking_time: '',
    notes: ''
  })
  
  // Auto-select service from URL query params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const serviceParam = params.get('service')
    if (serviceParam) {
      // Map frontend service titles to dropdown values if needed, otherwise exact match
      let mappedService = serviceParam
      if (serviceParam.includes('Drone')) mappedService = 'Drone Services'
      if (serviceParam.includes('3D') || serviceParam.includes('Floor')) mappedService = '3D Tour / Floorplan'
      
      setForm(prev => ({ ...prev, service: mappedService }))
    }
  }, [])
  
  // Calendar State
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState<'success' | 'error' | 'info'>('info')
  const [availableSlots, setAvailableSlots] = useState<string[]>([])
  const [loadingSlots, setLoadingSlots] = useState(false)

  const [monthAvailability, setMonthAvailability] = useState<{availableDates: string[], fullyBookedDates: string[]}>({ availableDates: [], fullyBookedDates: [] })
  const [loadingMonth, setLoadingMonth] = useState(false)

  // Use ref to store AbortController for cancelling previous requests
  const abortControllerRef = useRef<AbortController | null>(null)

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [])

  // Fetch month availability when service or month changes
  useEffect(() => {
    fetchMonthAvailability(form.service || 'Default', currentMonth.getFullYear(), currentMonth.getMonth() + 1)
  }, [form.service, currentMonth])

  const fetchMonthAvailability = async (service: string, year: number, month: number) => {
    setLoadingMonth(true)
    try {
      const res = await fetch(`/api/availability/month?service=${encodeURIComponent(service)}&year=${year}&month=${month}`)
      if (res.ok) {
        const data = await res.json()
        setMonthAvailability({
          availableDates: data.availableDates || [],
          fullyBookedDates: data.fullyBookedDates || []
        })
      }
    } catch (err) {
      console.error('Failed to fetch month availability:', err)
    } finally {
      setLoadingMonth(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      const data = await res.json()
      if (res.status === 409) {
        setMessage('This time slot has already been booked. Please choose another time.')
        setMessageType('error')
        // Refetch availability to get updated slots
        if (form.service && form.booking_date) {
          fetchAvailableSlots(form.service, form.booking_date)
          fetchMonthAvailability(form.service, currentMonth.getFullYear(), currentMonth.getMonth() + 1)
        }
      } else if (data.ok) {
        setStep(3)
        window.scrollTo({ top: 0, behavior: 'smooth' })
      } else {
        setMessage(data.error || 'Failed to create booking')
        setMessageType('error')
      }
    } catch (err) {
      setMessage('An error occurred')
      setMessageType('error')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    const newForm = { ...form, [name]: value }
    setForm(newForm)

    // If service changed and we have a selected date, fetch slots
    if (name === 'service' && selectedDate) {
      const dateStr = selectedDate.toLocaleDateString('en-CA')
      if (value) {
        fetchAvailableSlots(value, dateStr)
      } else {
        setAvailableSlots([])
        setForm(prev => ({ ...prev, [name]: value, booking_time: '' }))
      }
    }
  }

  // Handle calendar date click
  const handleDateClick = (date: Date) => {
    // Only allow future dates or today
    const startOfToday = new Date()
    startOfToday.setHours(0, 0, 0, 0)
    
    if (date < startOfToday) return

    setSelectedDate(date)
    const dateStr = date.toLocaleDateString('en-CA')
    setForm(prev => ({ ...prev, booking_date: dateStr, booking_time: '' }))
    
    if (form.service) {
      fetchAvailableSlots(form.service, dateStr)
    }
  }

  const fetchAvailableSlots = async (service: string, date: string) => {
    // Cancel any previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    // Create new AbortController for this request
    abortControllerRef.current = new AbortController()

    setLoadingSlots(true)
    console.log('Fetching slots for service:', service, 'date:', date)
    try {
      const res = await fetch(`/api/availability?service=${encodeURIComponent(service)}&date=${date}`, {
        signal: abortControllerRef.current.signal
      })
      console.log('Availability response:', res.status, res.statusText)

      if (res.ok) {
        const data = await res.json()
        console.log('Availability data:', data)
        setAvailableSlots(data.slots || [])
        // Clear selected time if it's no longer available
        if (form.booking_time && !data.slots.includes(form.booking_time)) {
          setForm(prev => ({ ...prev, booking_time: '' }))
        }
      } else {
        const errorText = await res.text()
        console.error('Availability API error:', errorText)
        setAvailableSlots([])
        setMessage(`Failed to load available slots: ${res.status}`)
        setMessageType('error')
      }
    } catch (err) {
      // Don't show error if request was aborted (normal behavior)
      if (err instanceof Error && err.name === 'AbortError') {
        console.log('Availability request cancelled')
        return
      }
      console.error('Error fetching slots:', err)
      setAvailableSlots([])
      setMessage(`Error loading slots: ${err instanceof Error ? err.message : 'Unknown error'}`)
      setMessageType('error')
    } finally {
      setLoadingSlots(false)
    }
  }

  // Calendar render helpers
  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate()
  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay()

  const renderCalendar = () => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()
    
    const daysInMonth = getDaysInMonth(year, month)
    const firstDay = getFirstDayOfMonth(year, month)
    
    const days = []
    
    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="p-2 sm:p-4"></div>)
    }
    
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day)
      const isPast = date < today
      const isSelected = selectedDate && date.getTime() === selectedDate.getTime()
      
      const dateStr = date.toLocaleDateString('en-CA')
      const isAvailable = monthAvailability.availableDates.includes(dateStr)
      const isFullyBooked = monthAvailability.fullyBookedDates.includes(dateStr)
      
      let dateStyleClass = 'hover:border-neutral-700 bg-white border border-transparent'
      let textWeightClass = 'font-medium text-black'

      if (!isPast) {
        if (isAvailable && !isFullyBooked) {
          dateStyleClass = 'bg-gray-100 text-black border border-gray-200 hover:bg-gray-200 hover:border-gray-300 hover:shadow-md cursor-pointer'
          textWeightClass = 'font-bold'
        } else {
          dateStyleClass = 'bg-black text-gray-400 border border-black cursor-not-allowed line-through decoration-gray-600'
          textWeightClass = 'font-medium'
        }
      }

      const isDisabled = isPast || !isAvailable || isFullyBooked
      
      days.push(
        <button
          key={day}
          type="button"
          disabled={isDisabled}
          onClick={() => handleDateClick(date)}
          className={`
            relative p-2 sm:p-4 rounded-xl flex flex-col items-center justify-center transition-all min-h-[60px] sm:min-h-[80px]
            ${isPast ? 'text-gray-300 cursor-not-allowed bg-transparent border border-transparent opacity-60' : dateStyleClass}
            ${isSelected ? '!bg-primary !text-black !border-primary shadow-[0_0_15px_rgba(var(--color-primary),0.3)] transform scale-[1.02] no-underline' : ''}
          `}
        >
          <span className={`text-lg sm:text-xl ${textWeightClass} ${isSelected ? '!text-black' : ''}`}>
            {day}
          </span>
        </button>
      )
    }
    
    return days
  }

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))
  }

  const prevMonth = () => {
    const today = new Date()
    const prev = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
    if (prev.getMonth() >= today.getMonth() || prev.getFullYear() > today.getFullYear()) {
      setCurrentMonth(prev)
    }
  }

  const isPrevDisabled = () => {
    const today = new Date()
    return currentMonth.getMonth() === today.getMonth() && currentMonth.getFullYear() === today.getFullYear()
  }

  return (
    <div className="min-h-screen bg-black py-16">
      <div className="container px-4 mx-auto max-w-4xl">
        <div className="mb-10 text-center animate-fade-in-up">
          <h1 className="text-4xl md:text-5xl font-normal text-white mb-4 font-heading tracking-tight">
            <span className="font-bold">Book</span> a Creative Session
          </h1>
          <p className="text-lg text-neutral-400 max-w-xl mx-auto">
            {step === 1 ? 'Select a package, date, and time for your session.' : 'Complete your booking details.'}
          </p>
        </div>

        {/* Stepper indicator */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-4">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full font-medium text-sm transition-colors ${step >= 1 ? 'bg-primary text-black' : 'bg-neutral-800 text-neutral-500'}`}>1</div>
            <div className={`h-1 w-8 sm:w-12 rounded-full transition-colors ${step >= 2 ? 'bg-primary' : 'bg-neutral-800'}`}></div>
            <div className={`flex items-center justify-center w-8 h-8 rounded-full font-medium text-sm transition-colors ${step >= 2 ? 'bg-primary text-black' : 'bg-neutral-800 text-neutral-500'}`}>2</div>
            <div className={`h-1 w-8 sm:w-12 rounded-full transition-colors ${step >= 3 ? 'bg-primary' : 'bg-neutral-800'}`}></div>
            <div className={`flex items-center justify-center w-8 h-8 rounded-full font-medium text-sm transition-colors ${step >= 3 ? 'bg-primary text-black' : 'bg-neutral-800 text-neutral-500'}`}>3</div>
          </div>
        </div>

        <Card className="shadow-2xl border border-neutral-800 rounded-3xl bg-neutral-900/90 backdrop-blur-md animate-fade-in-scale overflow-hidden">
          {step === 1 ? (
            <div className="p-6 md:p-10 space-y-10">
              
              {/* Service Selection */}
              <div className="space-y-4">
                <h2 className="text-xl font-normal text-white flex items-center gap-2 font-heading tracking-wide">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-neutral-800 text-white text-xs border border-neutral-700 font-sans">1</span>
                  Select <span className="font-bold">Package</span>
                </h2>
                <Select
                  name="service"
                  value={form.service}
                  onChange={handleChange}
                  required
                  className="bg-neutral-950 border border-neutral-700 text-white shadow-sm focus:border-primary focus:ring-primary/20 transition-all rounded-xl cursor-pointer py-3.5 text-base font-medium"
                >
                  <option value="">Choose a media package...</option>
                  <option value="Headliner">Headliner</option>
                  <option value="Motion Theory (Daylight)">Motion Theory (Daylight)</option>
                  <option value="Reel Time">Reel Time</option>
                  <option value="Streamline">Streamline</option>
                  <option value="Rental Roll">Rental Roll</option>
                  <option value="Signature Afterglow (Twilight)">Signature Afterglow (Twilight)</option>
                  <option value="Afterglow (Twilight)">Afterglow (Twilight)</option>
                </Select>
              </div>

              {/* Enhanced Calendar UI */}
              <div className="space-y-4 transition-opacity duration-300 opacity-100">
                <h2 className="text-xl font-normal text-white flex items-center gap-2 font-heading tracking-wide">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-neutral-800 text-white text-xs border border-neutral-700 font-sans">2</span>
                  Choose <span className="font-bold">Date</span>
                </h2>
                
                <div className="border border-neutral-800 rounded-2xl overflow-hidden bg-white shadow-inner">
                  <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
                    <button 
                      type="button" 
                      onClick={prevMonth}
                      disabled={isPrevDisabled()}
                      className="p-2 rounded-lg text-black hover:bg-gray-200 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <h3 className="text-xl font-heading font-bold text-black">
                      {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
                      {loadingMonth && <span className="ml-2 inline-block w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin align-middle"></span>}
                    </h3>
                    <button 
                      type="button" 
                      onClick={nextMonth}
                      className="p-2 rounded-lg text-black hover:bg-gray-200 transition-colors"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <div className="p-4 sm:p-6 bg-white">
                    <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-2">
                      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                        <div key={day} className="text-center text-sm font-semibold tracking-wider text-gray-500 py-2 uppercase">
                          {day}
                        </div>
                      ))}
                    </div>
                    <div className="grid grid-cols-7 gap-1 sm:gap-2 bg-white text-black">
                       {renderCalendar()}
                    </div>
                  </div>
                  
                  {/* Legend */}
                  <div className="flex items-center justify-center gap-4 sm:gap-6 p-4 border-t border-gray-200 bg-gray-50 text-sm font-medium text-gray-600 w-full flex-wrap">
                    <div className="flex items-center gap-2">
                      <span className="w-4 h-4 rounded-full bg-gray-100 border border-gray-300"></span>
                      Available
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-4 h-4 rounded-full bg-black border border-black"></span>
                      Unavailable
                    </div>
                  </div>
                </div>
              </div>

              {/* Time Slots */}
              {selectedDate && form.service && (
                <div className="space-y-4 animate-fade-in-up">
                  <h2 className="text-xl font-normal text-white flex items-center gap-2 font-heading tracking-wide">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-neutral-800 text-white text-xs border border-neutral-700 font-sans">3</span>
                    Select <span className="font-bold">Time</span>
                  </h2>
                  
                  {loadingSlots ? (
                    <div className="flex items-center justify-center p-8 bg-neutral-950/50 rounded-2xl border border-neutral-800">
                      <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mr-3"></div>
                      <span className="text-neutral-400 font-medium">Loading available times...</span>
                    </div>
                  ) : availableSlots.length === 0 ? (
                    <div className="p-8 text-center bg-orange-950/20 text-orange-200 rounded-2xl border border-orange-900/50">
                      <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p className="font-medium">No appointments available on this date.</p>
                      <p className="text-sm opacity-80 mt-1">Please select another date.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                      {availableSlots.map((time) => (
                        <button
                          key={time}
                          type="button"
                          onClick={() => setForm(prev => ({ ...prev, booking_time: time }))}
                          className={`
                            py-3 px-2 rounded-xl text-center font-medium text-base transition-all border
                            ${form.booking_time === time 
                              ? 'bg-primary text-black border-primary shadow-[0_0_15px_rgba(var(--color-primary),0.3)]' 
                              : 'bg-neutral-900/80 text-white border-neutral-700 hover:border-primary hover:bg-neutral-800 shadow-sm'
                            }
                          `}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Next Step Action */}
              <div className="pt-6 flex justify-end">
                <Button 
                  onClick={() => setStep(2)} 
                  disabled={!form.service || !form.booking_date || !form.booking_time}
                  className="px-8 py-3 text-lg h-auto rounded-xl shadow-md text-black"
                >
                  Continue to Details &rarr;
                </Button>
              </div>

            </div>
          ) : step === 2 ? (
            <div className="p-8 md:p-12">
              <button 
                onClick={() => setStep(1)}
                className="mb-8 flex items-center text-sm font-medium text-neutral-400 hover:text-white transition-colors"
                type="button"
              >
                <ChevronLeft className="w-4 h-4 mr-1" /> Back to Calendar
              </button>
              
              <form onSubmit={handleSubmit} className="space-y-10">
                
                {/* Booking Summary Box */}
                <div className="bg-neutral-950 p-6 rounded-2xl border border-neutral-800 flex flex-col md:flex-row gap-6 md:items-center justify-between">
                  <div>
                    <h3 className="font-bold text-white mb-1 text-lg">{form.service}</h3>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-neutral-400">
                      <span className="flex items-center gap-1.5"><CalendarIcon className="w-4 h-4 text-primary" /> {new Date(form.booking_date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                      <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-primary" /> {form.booking_time}</span>
                    </div>
                  </div>
                  <Button type="button" variant="outline" onClick={() => setStep(1)} className="shrink-0 text-sm py-1.5 border-neutral-700 hover:bg-neutral-800 hover:text-white">Change</Button>
                </div>
                
                {/* 01. Client Details */}
                <div className="space-y-6">
                  <h2 className="text-xs font-bold uppercase tracking-widest text-neutral-500 border-b border-neutral-800 pb-3 flex items-center gap-2">
                    <span className="text-primary">01.</span> Client Details
                  </h2>
                  
                  <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-neutral-300">Full Name *</label>
                      <Input
                        name="full_name"
                        value={form.full_name}
                        onChange={handleChange}
                        placeholder="e.g. Jane Doe"
                        required
                        className="bg-neutral-950 border-neutral-800 focus:bg-neutral-900 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all rounded-xl text-white"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-neutral-300">Email Address *</label>
                      <Input
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="jane@brokerage.com"
                        required
                        className="bg-neutral-950 border-neutral-800 focus:bg-neutral-900 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all rounded-xl text-white"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-neutral-300">Phone Number</label>
                      <Input
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="(555) 123-4567"
                        className="bg-neutral-950 border-neutral-800 focus:bg-neutral-900 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all rounded-xl text-white"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-neutral-300">Company / Agent</label>
                      <Input
                        name="company_name"
                        value={form.company_name}
                        onChange={handleChange}
                        placeholder="e.g. Century 21, John Smith"
                        className="bg-neutral-950 border-neutral-800 focus:bg-neutral-900 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all rounded-xl text-white"
                      />
                    </div>
                  </div>
                </div>

                {/* 02. Project Elements */}
                <div className="space-y-6">
                  <h2 className="text-xs font-bold uppercase tracking-widest text-neutral-500 border-b border-neutral-800 pb-3 flex items-center gap-2">
                    <span className="text-primary">02.</span> Project Elements
                  </h2>
                  
                  <div className="space-y-5">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-neutral-300">Details — Property address & instructions *</label>
                      <Textarea
                        name="notes"
                        value={form.notes}
                        onChange={handleChange}
                        placeholder="Enter the full property address, square footage, specific shot requests or access codes..."
                        rows={5}
                        required
                        className="bg-neutral-950 border-neutral-800 focus:bg-neutral-900 focus:border-primary transition-all rounded-xl resize-none text-white"
                      />
                    </div>
                  </div>
                </div>

                {message && (
                  <div className={`p-4 rounded-xl border ${
                    messageType === 'success' ? 'bg-green-950/30 border-green-900 text-green-400' : 
                    messageType === 'error' ? 'bg-red-950/30 border-red-900 text-red-400' : 
                    'bg-blue-950/30 border-blue-900 text-blue-400'
                  } flex items-start gap-3`}>
                    <div className="flex-1 text-sm font-medium leading-relaxed">{message}</div>
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-4 text-lg font-bold shadow-[0_0_20px_rgba(var(--color-primary),0.15)] hover:shadow-[0_0_25px_rgba(var(--color-primary),0.3)] transition-all text-black
                    ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:-translate-y-1'}
                  `}
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin mr-3"></div>
                      Processing Booking...
                    </div>
                  ) : 'Confirm Booking'}
                </Button>
              </form>
            </div>
          ) : step === 3 ? (
            <div className="p-8 md:p-16 text-center space-y-6 flex flex-col items-center justify-center animate-fade-in-up">
              <div className="w-20 h-20 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mb-4">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-3xl font-normal text-white mb-2 font-heading">Booking <span className="font-bold">Confirmed!</span></h2>
              <p className="text-neutral-400 text-lg max-w-md mx-auto">
                Thank you, <strong>{form.full_name}</strong>. We've received your request for <strong>{form.service}</strong> on <strong>{new Date(form.booking_date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</strong> at <strong>{form.booking_time}</strong>.
              </p>
              <p className="text-neutral-400 max-w-md mx-auto pb-4">
                A confirmation email has been sent to <strong>{form.email}</strong> with your session details. Our team will review the information and contact you if we need any additional details.
              </p>
              <Button 
                onClick={() => {
                  setForm({
                    full_name: '',
                    email: '',
                    phone: '',
                    company_name: '',
                    service: '',
                    booking_date: '',
                    booking_time: '',
                    notes: ''
                  })
                  setStep(1)
                  setSelectedDate(null)
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                }} 
                className="px-8 py-3 text-lg h-auto rounded-xl shadow-md text-black px-10"
              >
                Book Another Session
              </Button>
            </div>
          ) : null}
        </Card>
      </div>
    </div>
  )
}
