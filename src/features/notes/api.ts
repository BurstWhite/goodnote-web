import { request } from '../../lib/api.ts'
import type { CreateNoteRequest, Note, UpdateNoteRequest } from './types.ts'

export function listNotes() {
  return request<Note[]>('/notes')
}

export function getNote(id: number) {
  return request<Note>(`/notes/${id}`)
}

export function createNote(body: CreateNoteRequest) {
  return request<{ id: number }>('/notes', {
    method: 'POST',
    body: JSON.stringify(body),
  })
}

// 約定 PATCH 成功返回 200 + 完整 Note，但前端只依賴「成功了」，不讀返回值，
// 這樣 Go 端返回 204 也能正常工作
export async function updateNote(id: number, body: UpdateNoteRequest) {
  await request(`/notes/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(body),
  })
}

export async function deleteNote(id: number) {
  await request(`/notes/${id}`, { method: 'DELETE' })
}
