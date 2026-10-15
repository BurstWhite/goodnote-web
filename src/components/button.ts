const base =
  'inline-flex shrink-0 items-center justify-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium whitespace-nowrap transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600 disabled:pointer-events-none disabled:opacity-50'

const variants = {
  primary: 'bg-stone-900 text-white hover:bg-stone-700',
  secondary: 'border border-stone-300 bg-white text-stone-700 hover:bg-stone-100',
  ghost: 'text-stone-600 hover:bg-stone-100 hover:text-stone-900',
  danger: 'bg-red-600 text-white hover:bg-red-700',
  subtleDanger: 'text-red-700 hover:bg-red-50',
}

export type ButtonVariant = keyof typeof variants

// <button> 和做成按鈕樣子的 <Link> 共用同一套 class
export function buttonClass(variant: ButtonVariant = 'secondary') {
  return `${base} ${variants[variant]}`
}
