import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import clsx from 'clsx'
import styles from './RetroHeading.module.css'

const helperMap = {
  display: 'display-heading',
  head: 'section-heading',
} as const

type AllowedTags = 'h1' | 'h2' | 'h3'

type RetroHeadingProps = {
  as?: AllowedTags
  variant?: 'display' | 'head'
  tagline?: string
  className?: string
  children: ReactNode
} & Omit<ComponentPropsWithoutRef<'h2'>, 'className'>

export function RetroHeading({
  as = 'h2',
  variant = 'head',
  tagline,
  className,
  children,
  ...rest
}: RetroHeadingProps) {
  const Tag = as
  const headingClassName = clsx(
    styles.root,
    variant === 'display' ? styles.display : styles.head,
    className,
    helperMap[variant],
  )

  return (
    <Tag className={headingClassName} {...rest}>
      {tagline ? (
        <span className={clsx('eyebrow', styles.tagline)} data-testid="retro-heading-tagline">
          {tagline}
        </span>
      ) : null}
      <span className={styles.text}>{children}</span>
    </Tag>
  )
}
