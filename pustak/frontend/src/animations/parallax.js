import { useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'

export function useParallaxSection(inputRange = [0, 1], outputRange = ['-10%', '10%']) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const y = useTransform(scrollYProgress, inputRange, outputRange)
  return { ref, y, scrollYProgress }
}

export function useRevealSection() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 85%', 'start 20%'],
  })
  const opacity = useTransform(scrollYProgress, [0, 1], [0, 1])
  const y = useTransform(scrollYProgress, [0, 1], [50, 0])
  return { ref, opacity, y }
}
