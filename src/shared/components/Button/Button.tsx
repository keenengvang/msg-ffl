import type { ButtonHTMLAttributes, ComponentPropsWithoutRef, ReactNode } from 'react'
import { Link } from 'react-router-dom'
import clsx from 'clsx'
import styles from './Button.module.css'

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'link'
type Size = 'sm' | 'md' | 'lg' | 'icon'

type CommonProps = {
  variant?: Variant
  size?: Size
  chromed?: boolean
  fullWidth?: boolean
  loading?: boolean
  leftIcon?: ReactNode
  rightIcon?: ReactNode
  as?: 'button' | 'link'
}

type ButtonAsButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & { as?: 'button' }
type ButtonAsLinkProps = { as: 'link' } & Omit<ComponentPropsWithoutRef<typeof Link>, 'className' | 'children'>

type ButtonProps = CommonProps & (ButtonAsButtonProps | ButtonAsLinkProps)

function sizeClass(size: Size) {
  switch (size) {
    case 'sm':
      return styles.sizeSm
    case 'lg':
      return styles.sizeLg
    case 'icon':
      return styles.sizeIcon
    case 'md':
    default:
      return styles.sizeMd
  }
}

export function Button({
  variant = 'primary',
  size = 'md',
  chromed,
  fullWidth,
  loading,
  disabled,
  className,
  children,
  leftIcon,
  rightIcon,
  as = 'button',
  ...rest
}: ButtonProps) {
  const isDisabled = disabled || loading
  const showLeftIcon = leftIcon && !loading
  const showRightIcon = rightIcon && !loading

  const classNames = clsx(
    styles.root,
    styles[variant],
    sizeClass(size),
    chromed && styles.chromed,
    fullWidth && styles.fullWidth,
    isDisabled && styles.isDisabled,
    className,
  )

  const content = (
    <span className={styles.content}>
      {loading ? (
        <span className={styles.spinner} aria-hidden="true" data-role="spinner" />
      ) : showLeftIcon ? (
        <span className={styles.iconSlot} data-position="left" aria-hidden="true">
          {leftIcon}
        </span>
      ) : null}

      <span className={styles.label}>{children}</span>

      {showRightIcon ? (
        <span className={styles.iconSlot} data-position="right" aria-hidden="true">
          {rightIcon}
        </span>
      ) : null}
    </span>
  )

  if (as === 'link') {
    const linkProps = rest as ButtonAsLinkProps

    return (
      <Link
        className={classNames}
        aria-busy={Boolean(loading)}
        aria-disabled={isDisabled || undefined}
        data-variant={variant}
        data-size={size}
        tabIndex={isDisabled ? -1 : linkProps.tabIndex}
        {...linkProps}
      >
        {content}
      </Link>
    )
  }

  const buttonProps = rest as ButtonAsButtonProps
  const { type = 'button', ...buttonRest } = buttonProps

  return (
    <button
      className={classNames}
      disabled={isDisabled}
      type={type}
      aria-busy={Boolean(loading)}
      data-variant={variant}
      data-size={size}
      {...buttonRest}
    >
      {content}
    </button>
  )
}
