// 和 Go 端 internal/note/model.go 的 json tag 一一對應

export type Note = {
  id: number
  title: string
  content: string
}

export type CreateNoteRequest = {
  title: string
  content: string
}

// PATCH 的請求體：只帶要改的字段。這是和 Go 端約定的格式，
// Go 端用 *string 接收，就能區分「沒傳」和「傳了空字符串」。
export type UpdateNoteRequest = Partial<CreateNoteRequest>
