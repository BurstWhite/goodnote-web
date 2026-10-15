import { useParams } from 'react-router'
import { NoteForm } from '../features/notes/components/NoteForm.tsx'
import {
  NoteLoadError,
  NoteNotFound,
  NoteSkeleton,
} from '../features/notes/components/NoteStates.tsx'
import { parseNoteId } from '../features/notes/format.ts'
import { useNote, useUpdateNote } from '../features/notes/hooks.ts'
import type { UpdateNoteRequest } from '../features/notes/types.ts'

export function EditNote() {
  const id = parseNoteId(useParams().id)
  if (id === null) {
    return <NoteNotFound />
  }
  return <EditNoteView key={id} id={id} />
}

function EditNoteView({ id }: { id: number }) {
  const note = useNote(id)
  const updateNote = useUpdateNote(id)

  if (note.isPending) {
    return <NoteSkeleton />
  }
  // 只要拿到過數據就一直顯示表單：後台刷新失敗不能把正在寫的草稿換掉
  if (!note.data) {
    return <NoteLoadError error={note.error} onRetry={() => note.refetch()} />
  }

  const original = note.data
  return (
    <NoteForm
      heading="編輯筆記"
      initial={original}
      submitLabel="保存"
      cancelTo={`/notes/${id}`}
      pending={updateNote.isPending}
      error={updateNote.error}
      errorTitle="保存失敗"
      onSubmit={async (values) => {
        // PATCH 是部分更新：只發改了的字段，什麼都沒改就不發請求
        const changes: UpdateNoteRequest = {}
        if (values.title !== original.title) changes.title = values.title
        if (values.content !== original.content) changes.content = values.content
        if (Object.keys(changes).length > 0) {
          await updateNote.mutateAsync(changes)
        }
        return `/notes/${id}`
      }}
    />
  )
}
