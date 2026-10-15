import { isRouteErrorResponse, useRouteError } from 'react-router'
import { buttonClass } from '../components/button.ts'
import { PageTitle } from '../components/PageTitle.tsx'

// 渲染時拋出的意外錯誤會落到這裡（接口錯誤在各個頁面裡自己處理）
export function RouteError() {
  const error = useRouteError()
  let message: string
  if (isRouteErrorResponse(error)) {
    message = `${error.status} ${error.statusText}`
  } else if (error instanceof Error) {
    message = error.message
  } else {
    message = String(error)
  }

  return (
    <div className="flex h-dvh flex-col items-center justify-center gap-3 bg-stone-50 px-6 text-center">
      <PageTitle title="出錯了" />
      <h1 className="text-lg font-medium text-stone-900">頁面出錯了</h1>
      <p className="max-w-md text-sm break-words text-stone-600">{message}</p>
      {/* 用整頁刷新而不是路由跳轉，把出錯時的狀態一起清掉 */}
      <a href="/notes" className={`${buttonClass('primary')} mt-2`}>
        回到筆記列表
      </a>
    </div>
  )
}
