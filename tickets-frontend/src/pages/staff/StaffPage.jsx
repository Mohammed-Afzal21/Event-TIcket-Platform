import { useState, useEffect, useRef } from 'react'
import { useMutation } from '@tanstack/react-query'
import { validateTicket } from '../../lib/api'
import { FormField, Spinner } from '../../components/ui'
import { Scan, CheckCircle2, XCircle, Camera, Hash } from 'lucide-react'
import { Html5QrcodeScanner } from 'html5-qrcode'
import toast from 'react-hot-toast'
import { validationColor } from '../../lib/utils'

export default function StaffPage() {
  const [mode, setMode] = useState('qr')
  const [manualId, setManualId] = useState('')
  const [result, setResult] = useState(null)
  const scannerRef = useRef(null)
  const scannerDivRef = useRef(null)

  const validationMutation = useMutation({
    mutationFn: ({ id, method }) => validateTicket(id, method),
    onSuccess: (res) => {
      setResult(res.data)
      setManualId('')
      if (res.data.status === 'VALID') {
        toast.success('✓ Valid ticket', { duration: 2000 })
      } else {
        toast.error('Already validated', { duration: 2000 })
      }
    },
    onError: (err) => {
      toast.error(err.response?.data?.error || 'Validation failed')
      setResult(null)
    },
  })

  // Initialize QR scanner
  useEffect(() => {
    if (mode !== 'qr' || !scannerDivRef.current) return

    scannerRef.current = new Html5QrcodeScanner(
      'qr-reader',
      { fps: 10, qrbox: { width: 250, height: 250 } },
      false
    )

    scannerRef.current.render(
      (decodedText) => {
        validationMutation.mutate({ id: decodedText, method: 'QR_SCAN' })
        scannerRef.current.pause(true)
        setTimeout(() => scannerRef.current?.resume(), 2000)
      },
      () => {}
    )

    return () => {
      scannerRef.current?.clear()
    }
  }, [mode])

  const handleManual = (e) => {
    e.preventDefault()
    if (!manualId.trim()) return
    validationMutation.mutate({ id: manualId.trim(), method: 'MANUAL' })
  }

  return (
    <div className="page-container max-w-2xl">
      <div className="mb-8 animate-fade-up">
        <p className="font-mono text-xs uppercase tracking-widest text-amber-500 mb-2">Staff</p>
        <h1 className="font-display text-4xl font-800 text-night-50 leading-none mb-3">
          Ticket Validation
        </h1>
        <p className="text-night-400 text-sm">
          Scan QR codes or validate manually by ticket ID.
        </p>
      </div>

      {/* Mode toggle */}
      <div className="flex gap-2 mb-6 animate-fade-up" style={{ animationDelay: '60ms' }}>
        <button
          onClick={() => { setMode('qr'); setResult(null) }}
          className={mode === 'qr' ? 'btn-primary flex-1 flex items-center justify-center gap-2' : 'btn-secondary flex-1 flex items-center justify-center gap-2'}
        >
          <Camera size={14} />
          QR Scanner
        </button>
        <button
          onClick={() => { setMode('manual'); setResult(null) }}
          className={mode === 'manual' ? 'btn-primary flex-1 flex items-center justify-center gap-2' : 'btn-secondary flex-1 flex items-center justify-center gap-2'}
        >
          <Hash size={14} />
          Manual Entry
        </button>
      </div>

      <div className="card p-6 animate-fade-up" style={{ animationDelay: '120ms' }}>
        {mode === 'qr' ? (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Scan size={16} className="text-amber-500" />
              <p className="font-mono text-xs uppercase tracking-widest text-night-400">
                Position QR code in view
              </p>
            </div>
            <div
              id="qr-reader"
              ref={scannerDivRef}
              className="rounded-lg overflow-hidden bg-night-900 border border-night-700"
            />
          </div>
        ) : (
          <form onSubmit={handleManual} className="flex flex-col gap-4">
            <FormField label="Ticket ID">
              <input
                className="input font-mono"
                placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                value={manualId}
                onChange={(e) => setManualId(e.target.value)}
                autoFocus
              />
            </FormField>
            <button
              type="submit"
              disabled={validationMutation.isPending || !manualId.trim()}
              className="btn-primary flex items-center justify-center gap-2"
            >
              {validationMutation.isPending ? (
                <Spinner size={14} />
              ) : (
                <>
                  <CheckCircle2 size={14} />
                  Validate
                </>
              )}
            </button>
          </form>
        )}

        {/* Result */}
        {result && (
          <div className="mt-6 pt-6 border-t border-night-700/50 animate-fade-up">
            <div className="flex items-center gap-3 mb-4">
              {result.status === 'VALID' ? (
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
                  <CheckCircle2 size={18} className="text-emerald-400" />
                </div>
              ) : (
                <div className="w-10 h-10 rounded-full bg-red-500/20 border border-red-500/40 flex items-center justify-center">
                  <XCircle size={18} className="text-red-400" />
                </div>
              )}
              <div className="flex-1">
                <p className="font-display font-600 text-night-100 text-lg">
                  {result.status === 'VALID' ? 'Valid Ticket' : 'Invalid — Already Used'}
                </p>
                <p className="font-mono text-xs text-night-500">
                  {result.validationMethod} • {new Date().toLocaleTimeString()}
                </p>
              </div>
              <span className={validationColor(result.status)}>
                {result.status}
              </span>
            </div>
            <div className="text-xs font-mono text-night-600 break-all">
              Ticket ID: {result.ticketId}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
