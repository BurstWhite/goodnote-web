import type { ReactNode } from 'react'
import { Link, NavLink } from 'react-router'
import { ErrorAlert } from '../../../components/ErrorAlert.tsx'
import { describeError } from '../../../lib/api.ts'
import { contentPreview, displayTitle } from '../format.ts'
import { useNotes } from '../hooks.ts'
import type { Note } from '../types.ts'

type NoteListProps = {
  query: string
}

export function NoteList({ query }: NoteListProps) {
  const notes = useNotes()

  if (notes.isPending) {
    return <ListSkeleton />
  }
  // 一條數據都沒拿到才整塊顯示錯誤；已經有數據時刷新失敗（比如 Go 服務在重啟）
  // 就繼續顯示舊列表，只在底部提示
  if (!notes.data) {
    return (
      <div className="flex-1 px-3">
        <ErrorAlert
          title="筆記列表加載失敗"
          error={notes.error}
          onRetry={() => notes.refetch()}
        />
      </div>
    )
  }

  const q = query.trim().toLowerCase()
  // 服務端按 id 升序返回、沒有時間戳，倒過來讓新寫的在上面
  const visible = notes.data
    .filter((note) => matches(note, q))
    .toSorted((a, b) => b.id - a.id)

  let body: ReactNode
  if (notes.data.length === 0) {
    body = (
      <div className="px-3 py-10 text-center text-sm text-stone-500">
        <p>還沒有筆記</p>
        <Link
          to="/notes/new"
          className="mt-2 inline-block font-medium text-amber-700 hover:underline"
        >
          寫第一條
        </Link>
      </div>
    )
  } else if (visible.length === 0) {
    body = (
      <p className="px-3 py-10 text-center text-sm break-words text-stone-500">
        沒有匹配「{query.trim()}」的筆記
      </p>
    )
  } else {
    body = (
      <ul className="space-y-0.5">
        {visible.map((note) => (
          <li key={note.id}>
            <NoteListItem note={note} />
          </li>
        ))}
      </ul>
    )
  }

  return (
    <>
      <div className="min-h-0 flex-1 overflow-y-auto px-2 pb-2">{body}</div>
      <div className="flex items-center justify-between gap-2 border-t border-stone-200 px-4 py-2 text-xs text-stone-500">
        {notes.isError ? (
          <>
            <span
              className="truncate text-red-700"
              title={describeError(notes.error)}
            >
              刷新失敗：{describeError(notes.error)}
            </span>
            <button
              type="button"
              onClick={() => notes.refetch()}
              className="shrink-0 font-medium text-stone-700 hover:underline"
            >
              重試
            </button>
          </>
        ) : (
          <span>
            {q
              ? `匹配 ${visible.length} / ${notes.data.length} 條`
              : `共 ${notes.data.length} 條`}
          </span>
        )}
      </div>
    </>
  )
}

function matches(note: Note, q: string) {
  return (
    !q ||
    note.title.toLowerCase().includes(q) ||
    note.content.toLowerCase().includes(q)
  )
}

function NoteListItem({ note }: { note: Note }) {
  return (
    <NavLink
      to={`/notes/${note.id}`}
      className={({ isActive }) =>
        `block rounded-lg px-3 py-2.5 transition-colors ${
          isActive ? 'bg-amber-100' : 'hover:bg-stone-200/60'
        }`
      }
    >
      <p className="truncate text-sm font-medium text-stone-900">
        {displayTitle(note.title)}
      </p>
      <p className="mt-0.5 truncate text-sm text-stone-600">
        {contentPreview(note.content) || '無內容'}
      </p>
    </NavLink>
  )
}

function ListSkeleton() {
  return (
    <div className="flex-1 space-y-1 px-2" aria-busy="true" aria-label="加載中">
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className="space-y-2 px-3 py-3">
          <div className="h-3.5 w-2/3 animate-pulse rounded bg-stone-200" />
          <div className="h-3 w-5/6 animate-pulse rounded bg-stone-200/70" />
        </div>
      ))}
    </div>
  )
}
