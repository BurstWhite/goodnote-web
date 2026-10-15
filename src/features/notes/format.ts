// 標題可能是純空格（服務端目前不校驗），顯示時給個佔位
export function displayTitle(title: string) {
  return title.trim() || '無標題'
}

// 列表摘要：內容的第一個非空行
export function contentPreview(content: string) {
  return content.split('\n').find((line) => line.trim() !== '')?.trim() ?? ''
}

// 路由參數轉成 id。不是正整數就返回 null，沒必要發請求等服務端回 400
export function parseNoteId(param: string | undefined) {
  if (!param || !/^\d+$/.test(param)) return null
  const id = Number(param)
  return Number.isSafeInteger(id) ? id : null
}
