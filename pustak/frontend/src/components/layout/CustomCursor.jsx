import { useEffect, useState } from 'react'
import { motion, useSpring } from 'framer-motion'

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: -100, y: -100 })
  const [isHovering, setIsHovering] = useState(false)
  const [isHidden, setIsHidden] = useState(false)

  const springConfig = { damping: 20, stiffness: 250, mass: 0.5 }
  const cursorX = useSpring(position.x, springConfig)
  const cursorY = useSpring(position.y, springConfig)

  const followerX = useSpring(position.x, { damping: 30, stiffness: 150, mass: 0.8 })
  const followerY = useSpring(position.y, { damping: 30, stiffness: 150, mass: 0.8 })

  useEffect(() => {
    const move = (e) => {
      setPosition({ x: e.clientX, y: e.clientY })
      cursorX.set(e.clientX)
      cursorY.set(e.clientY)
      followerX.set(e.clientX)
      followerY.set(e.clientY)
    }

    const handleHoverStart = (e) => {
      if (e.target.closest('a, button, [class*="cursor-none"]')) {
        setIsHovering(true)
      }
    }
    const handleHoverEnd = () => setIsHovering(false)
    const handleLeave = () => setIsHidden(true)
    const handleEnter = () => setIsHidden(false)

    document.addEventListener('mousemove', move)
    document.addEventListener('mouseover', handleHoverStart)
    document.addEventListener('mouseout', handleHoverEnd)
    document.addEventListener('mouseleave', handleLeave)
    document.addEventListener('mouseenter', handleEnter)

    return () => {
      document.removeEventListener('mousemove', move)
      document.removeEventListener('mouseover', handleHoverStart)
      document.removeEventListener('mouseout', handleHoverEnd)
      document.removeEventListener('mouseleave', handleLeave)
      document.removeEventListener('mouseenter', handleEnter)
    }
  }, [])

  if (isHidden) return null

  return (
    <>
      {/* Main dot */}
      <motion.div
        className="custom-cursor"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: '-50%',
          translateY: '-50%',
        }}
      >
        <motion.div
          animate={isHovering ? { scale: 0.5, opacity: 0.8 } : { scale: 1, opacity: 1 }}
          transition={{ duration: 0.2 }}
          className="w-2 h-2 rounded-full bg-darkBrown"
        />
      </motion.div>

      {/* Follower ring */}
      <motion.div
        className="custom-cursor"
        style={{
          x: followerX,
          y: followerY,
          translateX: '-50%',
          translateY: '-50%',
        }}
      >
        <motion.div
          animate={isHovering
            ? { scale: 2.5, opacity: 0.6, backgroundColor: 'transparent', borderColor: '#B08D57' }
            : { scale: 1, opacity: 0.4, backgroundColor: 'transparent', borderColor: '#4D342B' }
          }
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="w-8 h-8 rounded-full border border-darkBrown"
        />
      </motion.div>
    </>
  )
}
