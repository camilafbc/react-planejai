import type { LucideIcon } from 'lucide-react'

import { Divider } from '@/components/shared/Divider'

interface CardProps {
  Icon: LucideIcon
  label: string
  value: string
  subtitle: string
}

interface CardListProps {
  title: string
  data: CardProps[]
  variant?: 'default' | 'primary'
}

const variantClasses = {
  default: {
    card: 'bg-card',
    accent: 'text-primary',
    value: 'text-foreground',
    subtitle: 'text-muted-foreground',
  },
  primary: {
    card: 'bg-primary',
    accent: 'text-primary-foreground',
    value: 'text-primary-foreground',
    subtitle: 'text-primary-foreground/70',
  },
}

export function CardList({ title, data, variant = 'default' }: CardListProps) {
  const styles = variantClasses[variant]

  return (
    <div
      className={['rounded-2xl p-6 shadow-[4px_4px_18px_0px_rgba(0,0,0,0.2)]', styles.card].join(
        ' ',
      )}
    >
      <p className="mb-6 text-lg font-semibold tracking-widest">{title}</p>
      {data.map(card => (
        <>
          <div className="mb-3 flex items-center gap-2">
            <card.Icon size={16} className={styles.accent} />
            <span
              className={['text-xs font-semibold tracking-widest uppercase', styles.accent].join(
                ' ',
              )}
            >
              {card.label}
            </span>
          </div>
          <p className={['text-3xl font-semibold', styles.value].join(' ')}>{card.value}</p>
          <p className={['mt-1 text-sm', styles.subtitle].join(' ')}>{card.subtitle}</p>
          <Divider />
        </>
      ))}
    </div>
  )
}
