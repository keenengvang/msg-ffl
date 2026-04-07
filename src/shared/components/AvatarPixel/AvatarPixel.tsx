import { useState } from 'react'
import clsx from 'clsx'
import { DICEBEAR_BASE } from '@/core/config/league'
import styles from './AvatarPixel.module.css'

type Size = 'sm' | 'md' | 'lg' | 'xl'

interface Props {
  src: string
  name: string
  size?: Size
  className?: string
}

export function AvatarPixel({ src, name, size = 'md', className }: Props) {
  const [errored, setErrored] = useState(false)
  const fallback = `${DICEBEAR_BASE}?seed=${encodeURIComponent(name)}&backgroundColor=0a0a0f`
  const imgSrc = errored ? fallback : src

  return (
    <div className={clsx(styles.wrapper, styles[size], className)}>
      <img src={imgSrc} alt={name} className={styles.img} onError={() => setErrored(true)} loading="lazy" />
    </div>
  )
}
