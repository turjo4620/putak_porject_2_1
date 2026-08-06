import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

export default function BookOpening() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  const leftPageRotate = useTransform(scrollYProgress, [0.1, 0.7], [0, -140])
  const rightPageRotate = useTransform(scrollYProgress, [0.1, 0.7], [0, 140])
  const leftPageOpacity = useTransform(scrollYProgress, [0, 0.15, 0.7, 0.9], [0, 1, 1, 0])
  const rightPageOpacity = useTransform(scrollYProgress, [0, 0.15, 0.7, 0.9], [0, 1, 1, 0])
  const bookScale = useTransform(scrollYProgress, [0.1, 0.5], [0.8, 1.4])
  const bookOpacity = useTransform(scrollYProgress, [0, 0.08, 0.65, 0.9], [0, 1, 1, 0])
  const textOpacity = useTransform(scrollYProgress, [0.3, 0.55], [0, 1])
  const textY = useTransform(scrollYProgress, [0.3, 0.55], [30, 0])

  return (
    <section
      ref={ref}
      className="relative h-[250vh] flex items-start justify-center bg-cream overflow-hidden"
    >
      <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-center overflow-hidden">
        {/* Cinematic book opening */}
        <motion.div
          style={{ scale: bookScale, opacity: bookOpacity }}
          className="relative flex items-center justify-center will-change-transform"
        >
          {/* Left page */}
          <motion.div
            style={{
              rotateY: leftPageRotate,
              opacity: leftPageOpacity,
              transformOrigin: 'right center',
              transformStyle: 'preserve-3d',
            }}
            className="w-36 h-52 md:w-52 md:h-72 bg-cream will-change-transform rounded-l-sm"
            transition={{ duration: 0 }}
          >
            <div
              className="w-full h-full rounded-l-sm flex items-center justify-center"
              style={{
                background: 'linear-gradient(to left, #E8E0D0, #F0EAE0)',
                boxShadow: 'inset -4px 0 8px rgba(0,0,0,0.1)',
              }}
            >
              <div className="w-3/4 h-3/4 flex flex-col gap-2 opacity-30">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="h-px bg-darkBrown/40 w-full" />
                ))}
              </div>
            </div>
          </motion.div>

          {/* Book spine */}
          <div
            className="relative z-10 w-4 h-52 md:h-72"
            style={{
              background: 'linear-gradient(to right, #4D342B, #6D4C41, #4D342B)',
              boxShadow: '0 8px 30px rgba(0,0,0,0.4)',
            }}
          >
            <div
              className="absolute inset-x-0 top-0 h-full"
              style={{
                background: 'linear-gradient(to bottom, rgba(176,141,87,0.3), transparent, rgba(176,141,87,0.2))',
              }}
            />
          </div>

          {/* Right page */}
          <motion.div
            style={{
              rotateY: rightPageRotate,
              opacity: rightPageOpacity,
              transformOrigin: 'left center',
              transformStyle: 'preserve-3d',
            }}
            className="w-36 h-52 md:w-52 md:h-72 will-change-transform"
            transition={{ duration: 0 }}
          >
            <div
              className="w-full h-full rounded-r-sm flex items-center justify-center"
              style={{
                background: 'linear-gradient(to right, #E8E0D0, #F0EAE0)',
                boxShadow: 'inset 4px 0 8px rgba(0,0,0,0.1)',
              }}
            >
              <div className="w-3/4 h-3/4 flex flex-col gap-2 opacity-30">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="h-px bg-darkBrown/40 w-full" />
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Transition text */}
        <motion.div
          style={{ opacity: textOpacity, y: textY }}
          className="absolute bottom-16 text-center"
        >
          <p className="font-heading text-2xl md:text-4xl font-light text-darkBrown">
            Step into the story
          </p>
        </motion.div>
      </div>
    </section>
  )
}
