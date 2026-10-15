import { QueryClient } from '@tanstack/react-query'
import { ApiError } from './api.ts'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // 4xx（比如筆記不存在）重試也不會變，直接交給頁面處理；其他錯誤最多重試 2 次
      retry: (failureCount, error) => {
        if (
          error instanceof ApiError &&
          error.status >= 400 &&
          error.status < 500
        ) {
          return false
        }
        return failureCount < 2
      },
    },
  },
})
