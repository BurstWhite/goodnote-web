import { useState } from 'react'
import { Link, Outlet, useMatch } from 'react-router'
import { buttonClass } from '../components/button.ts'
import { PlusIcon, SearchIcon } from '../components/icons.tsx'
import { NoteList } from '../features/notes/components/NoteList.tsx'

export function AppLayout() {
  const [query, setQuery] = useState('')
  // 窄屏一次只顯示一欄：在 /notes 顯示列表，其他頁面顯示右側內容
  const atList = useMatch('/notes') !== null

  return (
    <div className="flex h-dvh overflow-hidden bg-white text-stone-900">
      <aside
        className={`${atList ? 'flex' : 'hidden'} w-full flex-col border-stone-200 bg-stone-50 md:flex md:w-80 md:shrink-0 md:border-r`}
      >
        <div className="flex items-center justify-between gap-2 px-4 pt-4 pb-3">
          <Link to="/notes" className="text-lg font-semibold tracking-tight">
            GoodNote
          </Link>
          <Link to="/notes/new" className={buttonClass('primary')}>
            <PlusIcon />
            新建
          </Link>
        </div>
        <div className="px-4 pb-3">
          <label className="relative block">
            <span className="sr-only">搜索筆記</span>
            <SearchIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-stone-400" />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="搜索標題或內容"
              className="w-full rounded-lg border border-stone-300 bg-white py-1.5 pr-3 pl-9 text-sm placeholder:text-stone-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/30 focus:outline-none"
            />
          </label>
        </div>
        <NoteList query={query} />
      </aside>
      <main
        className={`${atList ? 'hidden' : 'flex'} min-w-0 flex-1 flex-col md:flex`}
      >
        <Outlet />
      </main>
    </div>
  )
}
