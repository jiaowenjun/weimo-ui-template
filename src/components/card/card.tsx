import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

import { getCardSurfaceClassName } from 'weimo-ui-core/components/card-surface'
import { cn } from 'weimo-ui-core/lib/utils'

import './card.css'

const cardVariants = cva('weimo-template-card', {
  variants: {
    variant: {
      default: '',
      interactive: 'weimo-template-card--interactive',
      strip: 'weimo-template-card--strip',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
})

const cardPanelVariants = cva('weimo-template-card__panel', {
  variants: {
    variant: {
      default: '',
      code: 'weimo-template-card__panel--code',
      stage: 'weimo-template-card__panel--stage',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
})

export type CardProps = ComponentPropsWithoutRef<'div'> &
  VariantProps<typeof cardVariants>

export type CardPanelProps = ComponentPropsWithoutRef<'div'> &
  VariantProps<typeof cardPanelVariants>

export type PreviewPageProps = {
  children?: ReactNode
  className?: string
  componentId?: string
  frame?: 'plain' | 'stage'
  panelClassName?: string
  summary?: ReactNode
}

type DivSlotProps = ComponentPropsWithoutRef<'div'> & {
  slot: string
  slotClassName: string
}

function DivSlot({
  className,
  slot,
  slotClassName,
  ...props
}: DivSlotProps) {
  return (
    <div
      className={cn(slotClassName, className)}
      data-slot={slot}
      {...props}
    />
  )
}

export function Card({ className, variant, ...props }: CardProps) {
  return (
    <div
      className={getCardSurfaceClassName(cardVariants({ variant }), className)}
      data-slot="card"
      {...props}
    />
  )
}

export function CardFrame({ className, ...props }: ComponentPropsWithoutRef<'div'>) {
  return (
    <div
      className={getCardSurfaceClassName(
        'weimo-template-card-frame',
        className,
      )}
      data-slot="card-frame"
      {...props}
    />
  )
}

export function CardFrameHeader({
  className,
  ...props
}: ComponentPropsWithoutRef<'div'>) {
  return (
    <DivSlot
      className={className}
      slot="card-frame-header"
      slotClassName="weimo-template-card-frame__header"
      {...props}
    />
  )
}

export function CardFrameTitle({
  className,
  ...props
}: ComponentPropsWithoutRef<'div'>) {
  return (
    <DivSlot
      className={className}
      slot="card-frame-title"
      slotClassName="weimo-template-card-frame__title"
      {...props}
    />
  )
}

export function CardFrameDescription({
  className,
  ...props
}: ComponentPropsWithoutRef<'div'>) {
  return (
    <DivSlot
      className={className}
      slot="card-frame-description"
      slotClassName="weimo-template-card-frame__description"
      {...props}
    />
  )
}

export function CardFrameAction({
  className,
  ...props
}: ComponentPropsWithoutRef<'div'>) {
  return (
    <DivSlot
      className={className}
      slot="card-frame-action"
      slotClassName="weimo-template-card-frame__action"
      {...props}
    />
  )
}

export function CardFrameFooter({
  className,
  ...props
}: ComponentPropsWithoutRef<'div'>) {
  return (
    <DivSlot
      className={className}
      slot="card-frame-footer"
      slotClassName="weimo-template-card-frame__footer"
      {...props}
    />
  )
}

export function CardHeader({ className, ...props }: ComponentPropsWithoutRef<'div'>) {
  return (
    <DivSlot
      className={className}
      slot="card-header"
      slotClassName="weimo-template-card__header"
      {...props}
    />
  )
}

export function CardTitle({ className, ...props }: ComponentPropsWithoutRef<'div'>) {
  return (
    <DivSlot
      className={className}
      slot="card-title"
      slotClassName="weimo-template-card__title"
      {...props}
    />
  )
}

export function CardDescription({
  className,
  ...props
}: ComponentPropsWithoutRef<'div'>) {
  return (
    <DivSlot
      className={className}
      slot="card-description"
      slotClassName="weimo-template-card__description"
      {...props}
    />
  )
}

export function CardAction({ className, ...props }: ComponentPropsWithoutRef<'div'>) {
  return (
    <DivSlot
      className={className}
      slot="card-action"
      slotClassName="weimo-template-card__action"
      {...props}
    />
  )
}

export function CardPanel({ className, variant, ...props }: CardPanelProps) {
  return (
    <div
      className={cn(cardPanelVariants({ variant }), className)}
      data-slot="card-panel"
      {...props}
    />
  )
}

export function CardFooter({ className, ...props }: ComponentPropsWithoutRef<'div'>) {
  return (
    <DivSlot
      className={className}
      slot="card-footer"
      slotClassName="weimo-template-card__footer"
      {...props}
    />
  )
}

export function PreviewPage({
  children,
  className,
  componentId,
  frame = 'stage',
  panelClassName,
  summary,
}: PreviewPageProps) {
  if (frame === 'plain') {
    return <>{children}</>
  }

  return (
    <CardFrame className={cn('weimo-template-preview-page', className)}>
      {summary ? (
        <p className="weimo-template-preview-page__summary">{summary}</p>
      ) : null}

      <div className="weimo-template-preview-page__demo">
        <CardPanel
          className={cn(
            'weimo-template-preview-page__stage',
            panelClassName,
          )}
          data-component-id={componentId}
          variant="stage"
        >
          {children}
        </CardPanel>
      </div>
    </CardFrame>
  )
}

export { CardPanel as CardContent }
