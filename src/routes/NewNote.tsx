import { NoteForm } from '../features/notes/components/NoteForm.tsx'
import { useCreateNote } from '../features/notes/hooks.ts'

export function NewNote() {
  const createNote = useCreateNote()

  return (
    <NoteForm
      heading="新建筆記"
      submitLabel="創建"
      cancelTo="/notes"
      pending={createNote.isPending}
      error={createNote.error}
      errorTitle="創建失敗"
      onSubmit={async (values) => {
        const { id } = await createNote.mutateAsync(values)
        return `/notes/${id}`
      }}
    />
  )
}
