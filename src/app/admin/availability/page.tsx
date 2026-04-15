'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface AvailabilityRule {
  id: string
  day_of_week: number
  start_time: string
  end_time: string
  slot_minutes: number
  enabled: boolean
}

interface AvailabilityBlock {
  id: string
  block_date: string
  start_time: string
  end_time: string
  reason: string
  created_at: string
}

const DAYS_OF_WEEK = [
  'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
]

export default function AdminAvailability() {
  const [rules, setRules] = useState<AvailabilityRule[]>([])
  const [blocks, setBlocks] = useState<AvailabilityBlock[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  // Recommend full days by default to make blocking time off easier
  const [newBlock, setNewBlock] = useState({
    block_date: '',
    start_time: '00:00',
    end_time: '23:59',
    reason: ''
  })

  useEffect(() => {
    loadData()
  }, [])

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 4000)
  }

  const loadData = async () => {
    try {
      const [rulesRes, blocksRes] = await Promise.all([
        fetch('/api/admin/availability/rules'),
        fetch('/api/admin/availability/blocks')
      ])

      if (rulesRes.ok && blocksRes.ok) {
        const rulesData = await rulesRes.json()
        const blocksData = await blocksRes.json()
        
        setRules(rulesData)
        
        // Sort blocks by date ascending (upcoming first)
        const sortedBlocks = (blocksData as AvailabilityBlock[]).sort((a, b) => 
          new Date(a.block_date).getTime() - new Date(b.block_date).getTime()
        )
        setBlocks(sortedBlocks)
      } else {
        showToast('Failed to load availability data', 'error')
      }
    } catch (err) {
      showToast('Error connecting to server', 'error')
    } finally {
      setLoading(false)
    }
  }

  const saveRules = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/admin/availability/rules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rules })
      })

      if (res.ok) {
        showToast('Weekly schedule updated successfully!')
        await loadData()
      } else {
        showToast('Failed to update schedule', 'error')
      }
    } catch (err) {
      showToast('Error saving changes', 'error')
    } finally {
      setSaving(false)
    }
  }

  const addBlock = async () => {
    if (!newBlock.block_date || !newBlock.start_time || !newBlock.end_time) {
      showToast('Please provide date and time range', 'error')
      return
    }

    setSaving(true)
    try {
      const res = await fetch('/api/admin/availability/blocks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newBlock)
      })

      if (res.ok) {
        showToast('Time off Block added successfully!')
        setNewBlock({ block_date: '', start_time: '00:00', end_time: '23:59', reason: '' })
        loadData()
      } else {
        showToast('Failed to add block', 'error')
      }
    } catch (err) {
      showToast('Error adding block', 'error')
    } finally {
      setSaving(false)
    }
  }

  const deleteBlock = async (id: string) => {
    if (!confirm('Remove this blocked time?')) return
    
    try {
      const res = await fetch(`/api/admin/availability/blocks?id=${id}`, {
        method: 'DELETE'
      })

      if (res.ok) {
        showToast('Block removed successfully!')
        loadData()
      } else {
        showToast('Failed to remove block', 'error')
      }
    } catch (err) {
      showToast('Error removing block', 'error')
    }
  }

  const updateRule = (dayOfWeek: number, field: keyof AvailabilityRule, value: string | number | boolean) => {
    setRules(prev => {
      const existingRule = prev.find(r => r.day_of_week === dayOfWeek)
      if (existingRule) {
        return prev.map(rule =>
          rule.day_of_week === dayOfWeek ? { ...rule, [field]: value } : rule
        )
      } else {
        return [...prev, {
          id: '',
          day_of_week: dayOfWeek,
          start_time: '09:00',
          end_time: '17:00',
          slot_minutes: 60,
          enabled: false,
          [field]: value
        } as AvailabilityRule]
      }
    })
  }

  const getRuleForDay = (dayOfWeek: number) => {
    return rules.find(r => r.day_of_week === dayOfWeek) || {
      id: '',
      day_of_week: dayOfWeek,
      start_time: '09:00',
      end_time: '17:00',
      slot_minutes: 60,
      enabled: false
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-50 p-6 md:p-10">
      <div className="max-w-6xl mx-auto space-y-8">
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 animate-fade-in-down">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Link href="/admin/bookings" className="text-neutral-400 hover:text-primary transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </Link>
              <h1 className="text-3xl font-bold font-heading text-neutral-900 tracking-tight">Availability Settings</h1>
            </div>
            <p className="text-sm text-neutral-500 ml-8">Manage standard working hours and block off specific dates.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Column: Weekly Schedule */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-3xl border border-neutral-200/60 shadow-xl overflow-hidden animate-fade-in-up">
              <div className="px-8 py-6 border-b border-neutral-100 bg-neutral-50/50 flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-bold text-neutral-900">Weekly Schedule</h2>
                  <p className="text-xs text-neutral-500 mt-1">Configure default available working days and hours.</p>
                </div>
                <button
                  onClick={saveRules}
                  disabled={saving}
                  className="px-6 py-2.5 bg-primary text-white text-sm font-medium rounded-xl hover:bg-primary-dark transition-colors disabled:opacity-50 shadow-md shadow-primary/20"
                >
                  {saving ? 'Saving...' : 'Save Schedule'}
                </button>
              </div>

              <div className="divide-y divide-neutral-50">
                {DAYS_OF_WEEK.map((dayName, index) => {
                  const rule = getRuleForDay(index)
                  return (
                    <div 
                      key={index} 
                      className={`p-6 transition-colors flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between ${
                        rule.enabled ? 'bg-white' : 'bg-neutral-50/30 opacity-75'
                      }`}
                    >
                      <div className="flex items-center gap-4 w-40">
                        <button
                          type="button"
                          onClick={() => updateRule(index, 'enabled', !rule.enabled)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                            rule.enabled ? 'bg-primary' : 'bg-neutral-300'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ease-in-out ${
                              rule.enabled ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                        <span className={`font-semibold ${rule.enabled ? 'text-neutral-900' : 'text-neutral-400'}`}>
                          {dayName}
                        </span>
                      </div>

                      {rule.enabled ? (
                        <div className="flex flex-wrap items-center gap-4 sm:gap-6 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-neutral-400 font-medium uppercase tracking-wider">From</span>
                            <input
                              type="time"
                              value={rule.start_time}
                              onChange={(e) => updateRule(index, 'start_time', e.target.value)}
                              className="bg-neutral-50 border border-neutral-200 text-neutral-900 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white transition-all text-sm outline-none"
                            />
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-neutral-400 font-medium uppercase tracking-wider">To</span>
                            <input
                              type="time"
                              value={rule.end_time}
                              onChange={(e) => updateRule(index, 'end_time', e.target.value)}
                              className="bg-neutral-50 border border-neutral-200 text-neutral-900 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white transition-all text-sm outline-none"
                            />
                          </div>

                          <div className="flex items-center gap-2 ml-auto">
                            <span className="text-xs text-neutral-400 font-medium uppercase tracking-wider">Dur.</span>
                            <select
                              value={rule.slot_minutes}
                              onChange={(e) => updateRule(index, 'slot_minutes', parseInt(e.target.value))}
                              className="bg-neutral-50 border border-neutral-200 text-neutral-900 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white transition-all text-sm outline-none cursor-pointer"
                            >
                              <option value={30}>30m</option>
                              <option value={60}>1h</option>
                              <option value={90}>1.5h</option>
                              <option value={120}>2h</option>
                            </select>
                          </div>
                        </div>
                      ) : (
                        <div className="flex-1 flex justify-end">
                          <span className="text-sm font-medium text-neutral-400 bg-neutral-100 border border-neutral-200 px-3 py-1 rounded-md">
                            Unavailable
                          </span>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Time Off / Blocks */}
          <div className="space-y-6">
            
            {/* Adding new block */}
            <div className="bg-white rounded-3xl border border-neutral-200/60 shadow-xl p-6 animate-fade-in-up delay-100">
              <h3 className="text-lg font-bold text-neutral-900 mb-1">Block Time Off</h3>
              <p className="text-xs text-neutral-500 mb-5">Manually block dates for vacations or shoots.</p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-1.5">Date</label>
                  <input
                    type="date"
                    value={newBlock.block_date}
                    onChange={(e) => setNewBlock(prev => ({ ...prev, block_date: e.target.value }))}
                    className="w-full bg-neutral-50 border border-neutral-200 text-neutral-900 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white transition-all outline-none"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-1.5">From</label>
                    <input
                      type="time"
                      value={newBlock.start_time}
                      onChange={(e) => setNewBlock(prev => ({ ...prev, start_time: e.target.value }))}
                      className="w-full bg-neutral-50 border border-neutral-200 text-neutral-900 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white transition-all outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-1.5">To</label>
                    <input
                      type="time"
                      value={newBlock.end_time}
                      onChange={(e) => setNewBlock(prev => ({ ...prev, end_time: e.target.value }))}
                      className="w-full bg-neutral-50 border border-neutral-200 text-neutral-900 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white transition-all outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-1.5">Reason (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. Travel, Off Grid"
                    value={newBlock.reason}
                    onChange={(e) => setNewBlock(prev => ({ ...prev, reason: e.target.value }))}
                    className="w-full bg-neutral-50 border border-neutral-200 text-neutral-900 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white transition-all outline-none"
                  />
                </div>

                <button
                  onClick={addBlock}
                  disabled={saving}
                  className="w-full py-3 bg-neutral-900 text-white text-sm font-semibold rounded-xl hover:bg-neutral-800 transition-colors mt-2 shadow-lg shadow-neutral-900/20"
                >
                  {saving ? 'Processing...' : '+ Add Time Off'}
                </button>
              </div>
            </div>

            {/* List of blocks */}
            <div className="bg-white rounded-3xl border border-neutral-200/60 shadow-xl p-6 animate-fade-in-up delay-200">
              <h3 className="text-md font-bold text-neutral-900 mb-4">Upcoming Blocked Dates</h3>
              
              {blocks.length === 0 ? (
                <div className="text-center py-8 bg-neutral-50 rounded-2xl border border-dashed border-neutral-200">
                  <p className="text-sm text-neutral-400 font-medium">No blocked dates scheduled</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                  {blocks.map((block) => {
                    // Safe parsing to avoid timezone day switching issues
                    const [year, month, day] = block.block_date.split('-').map(Number)
                    const blockDate = new Date(year, month - 1, day)
                    const today = new Date()
                    today.setHours(0,0,0,0)
                    const isPassed = blockDate < today
                    
                    return (
                      <div 
                        key={block.id} 
                        className={`p-4 rounded-2xl border transition-all ${isPassed ? 'bg-neutral-50 border-neutral-100 opacity-60' : 'bg-white border-neutral-200/80 shadow-sm'}`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div className={`font-semibold text-sm ${isPassed ? 'text-neutral-500' : 'text-neutral-900'}`}>
                            {blockDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                          </div>
                          <button
                            onClick={() => deleteBlock(block.id)}
                            className="text-neutral-400 hover:text-red-500 hover:bg-red-50 p-1 rounded transition-colors -mr-1 -mt-1"
                            title="Remove Block"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                        <div className={`text-xs font-medium flex items-center gap-1.5 mb-1.5 ${isPassed ? 'text-neutral-400' : 'text-primary'}`}>
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {block.start_time} - {block.end_time}
                        </div>
                        {block.reason && (
                          <div className={`text-xs inline-block px-2 py-0.5 rounded mt-1 font-medium ${isPassed ? 'bg-neutral-100 text-neutral-400' : 'bg-neutral-100 text-neutral-600'}`}>
                            {block.reason}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

          </div>
        </div>
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
            <span className="font-medium tracking-wide text-sm">{toast.message}</span>
            <button
              onClick={() => setToast(null)}
              className="ml-4 text-white/50 hover:text-white transition-colors text-xl font-light"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
