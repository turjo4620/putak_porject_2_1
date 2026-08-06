import { motion } from 'framer-motion'

export default function Button({ children, variant = 'primary', size = 'md', onClick, href, className = '' }) {
  const base = 'inline-flex items-center gap-2 font-body font-medium tracking-wider uppercase transition-all duration-500 cursor-none'

  const variants = {
    primary: 'bg-darkBrown text-cream hover:bg-woodBrown px-8 py-4 text-xs',
    outline: 'border border-darkBrown text-darkBrown hover:bg-darkBrown hover:text-cream px-8 py-4 text-xs',
    gold: 'bg-gold text-cream hover:bg-woodBrown px-8 py-4 text-xs',
    ghost: 'text-darkBrown hover:text-gold text-xs underline-offset-4 hover:underline',
    white: 'bg-cream text-darkBrown hover:bg-gold hover:text-cream px-8 py-4 text-xs',
  }

  const sizes = {
    sm: 'px-5 py-2.5 text-[10px]',
    md: 'px-8 py-4 text-xs',
    lg: 'px-10 py-5 text-sm',
  }

  const classes = `${base} ${variants[variant]} ${size !== 'md' ? sizes[size] : ''} ${className}`

  const motionProps = {
    whileHover: { scale: 1.02 },
    whileTap: { scale: 0.98 },
    transition: { duration: 0.2 },
  }

  if (href) {
    return (
      <motion.a href={href} className={classes} {...motionProps}>
        {children}
      </motion.a>
    )
  }

  return (
    <motion.button onClick={onClick} className={classes} {...motionProps}>
      {children}
    </motion.button>
  )
}
