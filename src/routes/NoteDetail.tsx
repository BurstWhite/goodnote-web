import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import { buttonClass } from '../components/button.ts'
import { ErrorStrip } from '../components/ErrorAlert.tsx'
import { PageHeader } from '../components/PageHeader.tsx'
import { PageTitle } from '../components/PageTitle.tsx'
import {
  NoteLoadError,
  NoteNotFound,
  NoteSkeleton,
} from '../features/notes/components/NoteStates.tsx'
import { displayTitle, parseNoteId } from '../features/notes/format.ts'
import { useDeleteNote, useNote } from '../features/notes/hooks.ts'
import { isApiError } from '../lib/api.ts'

export function NoteDetail() {
  const id = parseNoteId(useParams().id)
  if (id === null) {
    return <NoteNotFound />
  }
  // 用 id 作 key：切到另一條筆記時整個重新掛載，「確認刪除」之類的狀態不會帶過去
  return <NoteView key={id} id={id} />
}

function NoteView({ id }: { id: number }) {
  const note = useNote(id)
  const deleteNote = useDeleteNote()
  const navigate = useNavigate()
  const [confirmingDelete, setConfirmingDelete] = useState(false)

  if (note.isPending) {
    return <NoteSkeleton />
  }
  // 已經有數據時刷新失敗（比如 Go 服務在重啟）就繼續顯示舊內容；404 說明筆記已經沒了
  if (!note.data || isApiError(note.error, 404)) {
    return <NoteLoadError error={note.error} onRetry={() => note.refetch()} />
  }

  function handleDelete() {
    deleteNote.mutate(id, {
      onSuccess: () => navigate('/notes', { replace: true }),
      onError: () => setConfirmingDelete(false),
    })
  }

  return (
    <>
      <PageTitle title={displayTitle(note.data.title)} />
      <PageHeader>
        {confirmingDelete ? (
          <>
            <span className="hidden text-sm text-stone-600 sm:inline">
              確定刪除這條筆記？
            </span>
            <button
              type="button"
              onClick={() => setConfirmingDelete(false)}
              className={buttonClass('ghost')}
            >
              取消
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleteNote.isPending}
              className={buttonClass('danger')}
            >
              {deleteNote.isPending ? '刪除中…' : '確認刪除'}
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={() => setConfirmingDelete(true)}
              className={buttonClass('subtleDanger')}
            >
              刪除
            </button>
            <Link to="edit" className={buttonClass('secondary')}>
              編輯
            </Link>
          </>
        )}
      </PageHeader>
      {deleteNote.isError && (
        <ErrorStrip title="刪除失敗" error={deleteNote.error} />
      )}
      {note.isError && (
        <ErrorStrip
          title="刷新失敗，下面是之前加載的內容"
          error={note.error}
          onRetry={() => note.refetch()}
        />
      )}
      <div className="min-h-0 flex-1 overflow-y-auto">
        <article className="mx-auto max-w-3xl px-4 py-6 md:px-10 md:py-10">
          <h1 className="text-2xl font-semibold break-words text-stone-900">
            {displayTitle(note.data.title)}
          </h1>
          <p className="mt-1 text-xs text-stone-500">#{note.data.id}</p>
          <div className="mt-6 text-[15px] leading-7 break-words whitespace-pre-wrap text-stone-800">
            {note.data.content}
          </div>
        </article>
      </div>
    </>
  )
}
