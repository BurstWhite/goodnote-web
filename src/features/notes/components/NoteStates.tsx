import { Link } from 'react-router'
import { buttonClass } from '../../../components/button.ts'
import { ErrorAlert } from '../../../components/ErrorAlert.tsx'
import { PageHeader } from '../../../components/PageHeader.tsx'
import { PageTitle } from '../../../components/PageTitle.tsx'
import { isApiError } from '../../../lib/api.ts'

// 查看頁和編輯頁共用的「加載中 / 不存在 / 加載失敗」

export function NoteSkeleton() {
  return (
    <>
      <PageHeader />
      <div
        className="mx-auto w-full max-w-3xl space-y-3 px-4 py-6 md:px-10 md:py-10"
        aria-busy="true"
        aria-label="加載中"
      >
        <div className="h-7 w-1/2 animate-pulse rounded bg-stone-200" />
        <div className="h-3 w-10 animate-pulse rounded bg-stone-100" />
        <div className="space-y-3 pt-6">
          <div className="h-4 animate-pulse rounded bg-stone-100" />
          <div className="h-4 w-11/12 animate-pulse rounded bg-stone-100" />
          <div className="h-4 w-4/5 animate-pulse rounded bg-stone-100" />
        </div>
      </div>
    </>
  )
}

export function NoteNotFound() {
  return (
    <>
      <PageTitle title="筆記不存在" />
      <PageHeader />
      <div className="flex flex-1 flex-col items-center justify-center gap-2 px-6 text-center">
        <p className="font-medium text-stone-900">這條筆記不存在</p>
        <p className="text-sm text-stone-500">可能已經被刪除，或者鏈接有誤。</p>
        <Link to="/notes" className={`${buttonClass('secondary')} mt-3`}>
          回到列表
        </Link>
      </div>
    </>
  )
}

type NoteLoadErrorProps = {
  error: unknown
  onRetry: () => void
}

export function NoteLoadError({ error, onRetry }: NoteLoadErrorProps) {
  if (isApiError(error, 404)) {
    return <NoteNotFound />
  }
  return (
    <>
      <PageTitle title="加載失敗" />
      <PageHeader />
      <div className="mx-auto w-full max-w-3xl px-4 py-6 md:px-10 md:py-10">
        <ErrorAlert title="筆記加載失敗" error={error} onRetry={onRetry} />
      </div>
    </>
  )
}
