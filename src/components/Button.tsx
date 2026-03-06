import type { ReactNode } from 'react'

interface Props {
  variant?: 'primary' | 'secondary'
  href?: string
  onClick?: () => void
  disabled?: boolean
  className?: string
  title?: string
  children: ReactNode
}

export default function Button({
  variant = 'primary',
  href,
  onClick,
  disabled,
  className,
  title,
  children,
}: Props) {
  const cls = `btn btn-${variant}${className ? ` ${className}` : ''}`
  if (href && !disabled) {
    return (
      <a href={href} className={cls} title={title}>
        {children}
      </a>
    )
  }
  return (
    <button className={cls} onClick={onClick} disabled={disabled} title={title}>
      {children}
    </button>
  )
}
