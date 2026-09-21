'use client'

import { useEffect, useRef } from 'react'
import SignaturePad from 'signature_pad'

type Props = {
  onChange: (dataUrl: string | null) => void
  resetKey: string
}

// Canvas de firma. Se ajusta al ancho del contenedor y a la densidad de pantalla
// de la tablet para que el trazo no salga pixeleado.
export default function SignatureBox({ onChange, resetKey }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const padRef = useRef<SignaturePad | null>(null)
  const onChangeRef = useRef(onChange)
  onChangeRef.current = onChange

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const pad = new SignaturePad(canvas, {
      penColor: '#111827',
      backgroundColor: 'rgb(255,255,255)',
      minWidth: 1,
      maxWidth: 3,
    })
    padRef.current = pad

    const resize = () => {
      const ratio = Math.max(window.devicePixelRatio || 1, 1)
      const data = pad.toData()
      canvas.width = canvas.offsetWidth * ratio
      canvas.height = canvas.offsetHeight * ratio
      canvas.getContext('2d')!.scale(ratio, ratio)
      pad.clear()
      if (data.length) pad.fromData(data)
    }
    resize()
    window.addEventListener('resize', resize)

    const handleEnd = () => onChangeRef.current(pad.isEmpty() ? null : pad.toDataURL('image/png'))
    pad.addEventListener('endStroke', handleEnd)

    return () => {
      window.removeEventListener('resize', resize)
      pad.removeEventListener('endStroke', handleEnd)
      pad.off()
    }
  }, [resetKey])

  return (
    <div>
      <div className="relative rounded-xl border-2 border-dashed border-gray-400 bg-white">
        <canvas ref={canvasRef} className="block w-full h-48 md:h-56 touch-none rounded-xl" />
        <span className="pointer-events-none absolute bottom-3 left-4 right-4 border-t border-gray-300 pt-1 text-center text-xs text-gray-400">
          Firma aquí con el dedo
        </span>
      </div>
      <button
        type="button"
        onClick={() => {
          padRef.current?.clear()
          onChange(null)
        }}
        className="mt-3 px-5 py-3 rounded-lg bg-gray-800 text-white text-base font-semibold active:bg-gray-700"
      >
        Borrar firma
      </button>
    </div>
  )
}
