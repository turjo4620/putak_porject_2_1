import { useEffect, useRef } from 'react'
import { animate } from 'framer-motion'

export function useFloating(amplitude = 12, duration = 4) {
  const ref = useRef(null)

  useEffect(() => {
    if (!ref.current) return

    const controls = animate(ref.current, 
      { y: [-amplitude, amplitude, -amplitude] },
      {
        duration,
        repeat: Infinity,
        ease: 'easeInOut',
      }
    )

    return () => controls.stop()
  }, [amplitude, duration])

  return ref
}
