'use client'

import { Check } from 'lucide-react'

interface PlanCardProps {
  name: string
  price: string
  period: string
  description?: string
  features: string[]
  cta: string
  onClick: () => void
  highlighted?: boolean
  badge?: string
}

export function PlanCard({
  name,
  price,
  period,
  description,
  features,
  cta,
  onClick,
  highlighted = false,
  badge,
}: PlanCardProps) {
  return (
    <div
      className={`relative bg-white rounded-xl p-8 transition-all ${
        highlighted
          ? 'border-2 border-primary ring-2 ring-primary/10'
          : 'border-2 border-gray-200 hover:border-primary'
      }`}
    >
      {badge && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-white px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap">
          {badge}
        </div>
      )}

      <h3 className="text-2xl font-bold mb-2">{name}</h3>

      <div className="mb-1">
        <span className="text-5xl font-bold text-primary">{price}</span>
      </div>

      <p className="text-gray-600 mb-6 text-sm">{period}</p>

      {description && (
        <p className="text-gray-600 mb-6 text-sm">{description}</p>
      )}

      <button
        onClick={onClick}
        className={`w-full py-3 px-4 rounded-lg font-semibold mb-6 transition-all ${
          highlighted
            ? 'bg-primary text-white hover:bg-brand-700'
            : 'bg-white text-primary border-2 border-primary hover:bg-primary/5'
        }`}
      >
        {cta}
      </button>

      <div className="space-y-3">
        {features.map((feature, index) => (
          <div key={index} className="flex items-start gap-3 text-sm text-gray-700">
            <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <span>{feature}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
