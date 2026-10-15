import { describeError, isApiError } from '../lib/api.ts'
import { buttonClass } from './button.ts'

type ErrorAlertProps = {
  title: string
  error: unknown
  onRetry?: () => void
}

export function ErrorAlert({ title, error, onRetry }: ErrorAlertProps) {
  // 501 是「還沒做」而不是「出錯了」，用提示色區分開
  const notImplemented = isApiError(error, 501)
  return (
    <div
      role="alert"
      className={`rounded-lg border px-4 py-3 text-sm ${
        notImplemented
          ? 'border-amber-200 bg-amber-50 text-amber-900'
          : 'border-red-200 bg-red-50 text-red-800'
      }`}
    >
      <p className="font-medium">{title}</p>
      <p className="mt-1 break-words">{describeError(error)}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className={`${buttonClass('secondary')} mt-3`}
        >
          重試
        </button>
      )}
    </div>
  )
}

// 固定在頁頭下面、不跟內容一起滾動的版本：筆記很長時也能馬上看到
export function ErrorStrip(props: ErrorAlertProps) {
  return (
    <div className="border-b border-stone-200 px-4 py-3 md:px-6">
      <ErrorAlert {...props} />
    </div>
  )
}
