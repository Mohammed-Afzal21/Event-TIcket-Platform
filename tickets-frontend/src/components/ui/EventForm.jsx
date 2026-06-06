import { useState } from 'react'
import { FormField } from '../ui'
import { Plus, Trash2 } from 'lucide-react'

const EMPTY_TICKET_TYPE = { id: null, name: '', price: '', description: '', totalAvailable: '' }

function toInputDateTime(dt) {
  if (!dt) return ''
  const d = new Date(dt)
  const pad = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

export default function EventForm({ initial, onSubmit, loading }) {
  const [form, setForm] = useState({
    id: initial?.id ?? null,
    name: initial?.name ?? '',
    start: toInputDateTime(initial?.start),
    end: toInputDateTime(initial?.end),
    venue: initial?.venue ?? '',
    salesStart: toInputDateTime(initial?.salesStart),
    salesEnd: toInputDateTime(initial?.salesEnd),
    status: initial?.status ?? 'DRAFT',
    ticketTypes: initial?.ticketTypes?.map((tt) => ({
      id: tt.id ?? null,
      name: tt.name ?? '',
      price: tt.price ?? '',
      description: tt.description ?? '',
      totalAvailable: tt.totalAvailable ?? '',
    })) ?? [{ ...EMPTY_TICKET_TYPE }],
  })

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }))

  const setTt = (idx, field) => (e) =>
    setForm((f) => ({
      ...f,
      ticketTypes: f.ticketTypes.map((tt, i) =>
        i === idx ? { ...tt, [field]: e.target.value } : tt
      ),
    }))

  const addTt = () =>
    setForm((f) => ({ ...f, ticketTypes: [...f.ticketTypes, { ...EMPTY_TICKET_TYPE }] }))

  const removeTt = (idx) =>
    setForm((f) => ({ ...f, ticketTypes: f.ticketTypes.filter((_, i) => i !== idx) }))

  const handleSubmit = (e) => {
    e.preventDefault()
    const payload = {
      ...form,
      start: form.start || null,
      end: form.end || null,
      salesStart: form.salesStart || null,
      salesEnd: form.salesEnd || null,
      ticketTypes: form.ticketTypes.map((tt) => ({
        ...tt,
        price: parseFloat(tt.price) || 0,
        totalAvailable: tt.totalAvailable ? parseInt(tt.totalAvailable) : null,
      })),
    }
    onSubmit(payload)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {/* Basic info */}
      <FormField label="Event name">
        <input className="input" value={form.name} onChange={set('name')} required placeholder="My Amazing Event" />
      </FormField>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField label="Start">
          <input className="input" type="datetime-local" value={form.start} onChange={set('start')} />
        </FormField>
        <FormField label="End">
          <input className="input" type="datetime-local" value={form.end} onChange={set('end')} />
        </FormField>
      </div>

      <FormField label="Venue">
        <input className="input" value={form.venue} onChange={set('venue')} required placeholder="Madison Square Garden, NYC" />
      </FormField>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField label="Sales start">
          <input className="input" type="datetime-local" value={form.salesStart} onChange={set('salesStart')} />
        </FormField>
        <FormField label="Sales end">
          <input className="input" type="datetime-local" value={form.salesEnd} onChange={set('salesEnd')} />
        </FormField>
      </div>

      <FormField label="Status">
        <select className="input" value={form.status} onChange={set('status')}>
          <option value="DRAFT">DRAFT</option>
          <option value="PUBLISHED">PUBLISHED</option>
        </select>
      </FormField>

      {/* Ticket types */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="label mb-0">Ticket Types</label>
          <button type="button" onClick={addTt} className="btn-ghost text-xs font-mono text-amber-400 hover:bg-amber-500/10 flex items-center gap-1 py-1 px-2">
            <Plus size={12} /> Add type
          </button>
        </div>

        <div className="flex flex-col gap-3">
          {form.ticketTypes.map((tt, idx) => (
            <div key={idx} className="card p-4 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-night-500">Type #{idx + 1}</span>
                {form.ticketTypes.length > 1 && (
                  <button type="button" onClick={() => removeTt(idx)} className="text-night-600 hover:text-red-400 transition-colors">
                    <Trash2 size={13} />
                  </button>
                )}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <FormField label="Name">
                  <input className="input text-xs" value={tt.name} onChange={setTt(idx, 'name')} required placeholder="VIP" />
                </FormField>
                <FormField label="Price (USD)">
                  <input className="input text-xs" type="number" min="0" step="0.01" value={tt.price} onChange={setTt(idx, 'price')} required placeholder="49.99" />
                </FormField>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <FormField label="Description">
                  <input className="input text-xs" value={tt.description} onChange={setTt(idx, 'description')} placeholder="Includes backstage pass" />
                </FormField>
                <FormField label="Total available">
                  <input className="input text-xs" type="number" min="1" value={tt.totalAvailable} onChange={setTt(idx, 'totalAvailable')} placeholder="Unlimited" />
                </FormField>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button type="submit" disabled={loading} className="btn-primary">
        {loading ? 'Saving…' : 'Save Event'}
      </button>
    </form>
  )
}
