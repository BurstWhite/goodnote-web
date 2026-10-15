// 所有請求都走這裡：拼接口前綴、處理 JSON、把各種錯誤響應整理成 ApiError。
// 以後鑑權要帶 token，也只改這個文件。

const API_PREFIX = '/api/v1'

export class ApiError extends Error {
  readonly method: string
  readonly path: string
  // 0 表示根本沒拿到 HTTP 響應（斷網、開發服務器沒開）
  readonly status: number

  constructor(method: string, path: string, status: number, message: string) {
    super(message)
    this.name = 'ApiError'
    this.method = method
    this.path = path
    this.status = status
  }
}

export async function request<T = unknown>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const method = (init.method ?? 'GET').toUpperCase()
  const url = API_PREFIX + path
  const headers = new Headers(init.headers)
  if (init.body !== undefined && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }

  let res: Response
  try {
    res = await fetch(url, { ...init, method, headers })
  } catch {
    throw new ApiError(method, url, 0, '網絡請求失敗，請確認開發服務器還在運行')
  }

  // body 只讀一次：204 和空 body 都當作沒有返回值
  const text = await res.text()
  if (!res.ok) {
    throw new ApiError(method, url, res.status, errorMessage(res, text))
  }
  if (!text) {
    return undefined as T
  }
  try {
    return JSON.parse(text) as T
  } catch {
    throw new ApiError(method, url, res.status, '服務端返回的不是 JSON')
  }
}

// Go 端的錯誤體目前有三種：{"error": ...}、501 的 {"message": ...}、
// gin 自己返回的純文本（比如路由不存在時的 404）。這裡統一取出一句話。
function errorMessage(res: Response, text: string): string {
  if (res.status === 502 && !text) {
    // Vite 代理連不上 Go 服務時，返回的就是空 body 的 502
    return '連不上 Go 服務，請確認它在 :8080 上運行'
  }
  try {
    const body: unknown = JSON.parse(text)
    if (body && typeof body === 'object') {
      if ('error' in body && typeof body.error === 'string') return body.error
      if ('message' in body && typeof body.message === 'string') {
        return body.message
      }
    }
  } catch {
    // 不是 JSON，用下面的純文本
  }
  return text.trim() || res.statusText || `HTTP ${res.status}`
}

export function isApiError(error: unknown, status?: number): error is ApiError {
  return (
    error instanceof ApiError && (status === undefined || error.status === status)
  )
}

// 給界面展示用的一句話。服務端原始信息和狀態碼也帶上，方便對照 Go 代碼排查。
export function describeError(error: unknown): string {
  if (error instanceof ApiError) {
    if (error.status === 0) return error.message
    if (error.status === 501) {
      return `服務端還沒實現 ${error.method} ${error.path}（501 ${error.message}）`
    }
    return `${error.message}（${error.method} ${error.path} → ${error.status}）`
  }
  if (error instanceof Error) return error.message
  return String(error)
}
