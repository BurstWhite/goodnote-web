import { Link } from 'react-router'
import { buttonClass } from '../components/button.ts'
import { NoteIcon, PlusIcon } from '../components/icons.tsx'

// 寬屏下右側的空狀態；窄屏時這一欄是隱藏的
export function NotesIndex() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
      <NoteIcon className="size-10 text-stone-300" />
      <p className="text-sm text-stone-500">從左邊選一條筆記，或者</p>
      <Link to="/notes/new" className={buttonClass('primary')}>
        <PlusIcon />
        新建筆記
      </Link>
    </div>
  )
}
