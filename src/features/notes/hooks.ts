import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createNote,
  deleteNote,
  getNote,
  listNotes,
  updateNote,
} from './api.ts'
import type { CreateNoteRequest, Note, UpdateNoteRequest } from './types.ts'

// 緩存的 key。讓 noteKeys.all 失效會同時刷新列表和所有詳情
export const noteKeys = {
  all: ['notes'] as const,
  list: () => [...noteKeys.all, 'list'] as const,
  detail: (id: number) => [...noteKeys.all, 'detail', id] as const,
}

export function useNotes() {
  return useQuery({
    queryKey: noteKeys.list(),
    queryFn: listNotes,
  })
}

export function useNote(id: number) {
  const queryClient = useQueryClient()
  return useQuery({
    queryKey: noteKeys.detail(id),
    queryFn: () => getNote(id),
    // 列表接口已經返回了完整內容，先拿列表裡的數據顯示，不用等詳情請求
    initialData: () =>
      queryClient
        .getQueryData<Note[]>(noteKeys.list())
        ?.find((note) => note.id === id),
    initialDataUpdatedAt: () =>
      queryClient.getQueryState(noteKeys.list())?.dataUpdatedAt,
  })
}

export function useCreateNote() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (body: CreateNoteRequest) => createNote(body),
    onSuccess: ({ id }, body) => {
      // POST 只返回 id，內容就是剛提交的，直接放進緩存，跳轉過去不用再等請求
      queryClient.setQueryData<Note>(noteKeys.detail(id), { id, ...body })
      return queryClient.invalidateQueries({ queryKey: noteKeys.list() })
    },
  })
}

export function useUpdateNote(id: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (body: UpdateNoteRequest) => updateNote(id, body),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: noteKeys.all }),
  })
}

export function useDeleteNote() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => deleteNote(id),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: noteKeys.list() }),
  })
}
