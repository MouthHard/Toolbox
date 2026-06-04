import React, { memo } from 'react'
import './index.scss'

const SKELETON_SIZES = {
  title: { width: 'w-32', height: 'h-6' },
  stat: { width: 'w-16', height: 'h-4' },
  line: { width: 'w-full', height: 'h-4' },
  lineShort: { width: 'w-4/5', height: 'h-4' },
  tag: { width: 'w-16', height: 'h-5' },
  button: { width: 'w-24', height: 'h-8' },
  iconButton: { width: 'w-9', height: 'h-9' },
} as const

interface SkeletonLineProps {
  width: string
  height: string
  className?: string
}

const SkeletonLine: React.FC<SkeletonLineProps> = memo(({ width, height, className = '' }) => (
  <div className={`skeleton-line ${width} ${height} ${className}`} />
))

SkeletonLine.displayName = 'SkeletonLine'

interface SkeletonTagProps {
  width: string
  height: string
}

const SkeletonTag: React.FC<SkeletonTagProps> = memo(({ width, height }) => (
  <div className={`skeleton-tag ${width} ${height}`} />
))

SkeletonTag.displayName = 'SkeletonTag'

const SkeletonCard: React.FC = memo(() => {
  const { title, stat, line, lineShort, tag, button, iconButton } = SKELETON_SIZES

  return (
    <div className="tool-card shimmer-effect">
      <div className="tool-top-section">
        <div className="tool-icon-wrapper" />
        <div className="tool-info-group">
          <SkeletonLine {...title} />
          <div className="tool-quick-stats">
            <SkeletonLine {...stat} className="quick-stat" />
            <SkeletonLine {...stat} className="quick-stat" />
          </div>
        </div>
      </div>

      <SkeletonLine {...line} className="mt-3" />
      <SkeletonLine {...lineShort} className="mt-2" />

      <div className="flex gap-1.5 mt-4">
        <SkeletonTag {...tag} />
        <SkeletonTag {...tag} />
        <SkeletonTag {...tag} />
      </div>

      <div className="flex justify-between items-center mt-4 pt-4 border-t border-slate-700/50">
        <SkeletonLine {...button} />
        <div className="flex gap-2">
          <SkeletonLine {...iconButton} className="rounded-lg" />
          <SkeletonLine {...iconButton} className="rounded-lg" />
        </div>
      </div>
    </div>
  )
})

SkeletonCard.displayName = 'SkeletonCard'

export default SkeletonCard
