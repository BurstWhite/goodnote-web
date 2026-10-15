import type { ReactNode } from 'react'
import { Link } from 'react-router'
import { ChevronLeftIcon } from './icons.tsx'

type PageHeaderProps = {
  title?: string
  children?: ReactNode
}

// 右側內容區頂部的操作欄。窄屏下列表是隱藏的，所以左邊多一個返回按鈕。
export function PageHeader({ title, children }: PageHeaderProps) {
  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b border-stone-200 px-3 md:px-6">
      <Link
        to="/notes"
        className="inline-flex items-center gap-0.5 rounded-lg py-1 pr-2 pl-1 text-sm text-stone-600 hover:bg-stone-100 hover:text-stone-900 md:hidden"
      >
        <ChevronLeftIcon />
        筆記
      </Link>
      {title && (
        <h1 className="truncate text-sm font-medium text-stone-600">{title}</h1>
      )}
      <div className="ml-auto flex items-center gap-2">{children}</div>
    </header>
  )
}
