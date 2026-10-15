import { Link } from 'react-router'
import { buttonClass } from '../components/button.ts'
import { PageTitle } from '../components/PageTitle.tsx'

export function NotFound() {
  return (
    <div className="flex h-dvh flex-col items-center justify-center gap-3 bg-stone-50 px-6 text-center">
      <PageTitle title="頁面不存在" />
      <p className="text-5xl font-semibold text-stone-300">404</p>
      <h1 className="text-lg font-medium text-stone-900">找不到這個頁面</h1>
      <Link to="/notes" className={`${buttonClass('primary')} mt-2`}>
        回到筆記列表
      </Link>
    </div>
  )
}
