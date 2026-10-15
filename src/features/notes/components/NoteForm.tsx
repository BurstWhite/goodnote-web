import { useEffect, useId, useRef, useState, type SubmitEvent } from 'react'
import { Link, useBlocker, useNavigate } from 'react-router'
import { buttonClass } from '../../../components/button.ts'
import { ErrorStrip } from '../../../components/ErrorAlert.tsx'
import { PageHeader } from '../../../components/PageHeader.tsx'
import { PageTitle } from '../../../components/PageTitle.tsx'
import type { CreateNoteRequest } from '../types.ts'

type NoteFormProps = {
  heading: string
  initial?: CreateNoteRequest
  submitLabel: string
  cancelTo: string
  pending: boolean
  error: unknown
  errorTitle: string
  // 保存成功後 resolve 出要跳轉的路徑；失敗就 reject，錯誤通過 error 展示
  onSubmit: (values: CreateNoteRequest) => Promise<string>
}

type FieldErrors = Partial<Record<keyof CreateNoteRequest, string>>

const EMPTY: CreateNoteRequest = { title: '', content: '' }

// 新建和編輯共用的表單
export function NoteForm({
  heading,
  initial = EMPTY,
  submitLabel,
  cancelTo,
  pending,
  error,
  errorTitle,
  onSubmit,
}: NoteFormProps) {
  const id = useId()
  const navigate = useNavigate()
  const [title, setTitle] = useState(initial.title)
  const [content, setContent] = useState(initial.content)
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const titleRef = useRef<HTMLInputElement>(null)
  const contentRef = useRef<HTMLTextAreaElement>(null)
  // 保存成功後是這裡主動跳轉的，這次跳轉不應該被「未保存」攔下
  const leaving = useRef(false)

  const dirty = title !== initial.title || content !== initial.content

  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      dirty &&
      !leaving.current &&
      currentLocation.pathname !== nextLocation.pathname,
  )

  // 刷新、關閉標籤頁時也提醒
  useEffect(() => {
    if (!dirty) return
    const onBeforeUnload = (event: BeforeUnloadEvent) => event.preventDefault()
    window.addEventListener('beforeunload', onBeforeUnload)
    return () => window.removeEventListener('beforeunload', onBeforeUnload)
  }, [dirty])

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    if (pending) return

    // 服務端兩個字段都是 binding:"required"，但出錯時只回一句 invalid request body，
    // 所以先在這裡檢查，給出具體的提示
    const values = { title: title.trim(), content }
    const errors: FieldErrors = {}
    if (!values.title) errors.title = '標題不能為空'
    if (!values.content.trim()) errors.content = '內容不能為空'
    setFieldErrors(errors)
    if (errors.title) {
      titleRef.current?.focus()
      return
    }
    if (errors.content) {
      contentRef.current?.focus()
      return
    }

    let to: string
    try {
      to = await onSubmit(values)
    } catch {
      return // 錯誤由 error 展示，草稿保留
    }
    leaving.current = true
    navigate(to)
  }

  return (
    <>
      <PageTitle title={heading} />
      <PageHeader title={heading}>
        <Link to={cancelTo} className={buttonClass('ghost')}>
          取消
        </Link>
        <button
          type="submit"
          form={id}
          disabled={pending}
          className={buttonClass('primary')}
        >
          {pending ? '保存中…' : submitLabel}
        </button>
      </PageHeader>

      {blocker.state === 'blocked' && (
        <div
          role="alert"
          className="flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-amber-200 bg-amber-50 px-4 py-2.5 text-sm text-amber-900 md:px-6"
        >
          <span>有未保存的修改，離開後會丟失。</span>
          <div className="ml-auto flex gap-2">
            <button
              type="button"
              onClick={() => blocker.reset()}
              className={buttonClass('secondary')}
            >
              繼續編輯
            </button>
            <button
              type="button"
              onClick={() => blocker.proceed()}
              className={buttonClass('danger')}
            >
              放棄修改
            </button>
          </div>
        </div>
      )}
      {error != null && <ErrorStrip title={errorTitle} error={error} />}

      <form
        id={id}
        onSubmit={handleSubmit}
        noValidate
        className="min-h-0 flex-1 overflow-y-auto"
      >
        <div className="mx-auto flex max-w-3xl flex-col gap-6 px-4 py-6 md:px-10 md:py-10">
          <div>
            <label htmlFor={`${id}-title`} className="sr-only">
              標題
            </label>
            <input
              ref={titleRef}
              id={`${id}-title`}
              value={title}
              onChange={(event) => {
                setTitle(event.target.value)
                setFieldErrors((errors) => ({ ...errors, title: undefined }))
              }}
              placeholder="標題"
              autoComplete="off"
              aria-invalid={fieldErrors.title ? true : undefined}
              aria-describedby={
                fieldErrors.title ? `${id}-title-error` : undefined
              }
              className="w-full border-b border-stone-200 bg-transparent pb-2 text-2xl font-semibold text-stone-900 placeholder:text-stone-400 focus:border-amber-500 focus:outline-none aria-invalid:border-red-500"
            />
            {fieldErrors.title && (
              <p id={`${id}-title-error`} className="mt-1.5 text-sm text-red-700">
                {fieldErrors.title}
              </p>
            )}
          </div>
          <div>
            <label htmlFor={`${id}-content`} className="sr-only">
              內容
            </label>
            {/* 支持 field-sizing 的瀏覽器裡高度跟著內容長，其他瀏覽器可以手動拖 */}
            <textarea
              ref={contentRef}
              id={`${id}-content`}
              value={content}
              onChange={(event) => {
                setContent(event.target.value)
                setFieldErrors((errors) => ({ ...errors, content: undefined }))
              }}
              placeholder="寫點什麼…"
              aria-invalid={fieldErrors.content ? true : undefined}
              aria-describedby={
                fieldErrors.content ? `${id}-content-error` : undefined
              }
              className="field-sizing-content min-h-72 w-full resize-y rounded-lg bg-stone-50 p-4 text-[15px] leading-7 text-stone-800 ring-1 ring-stone-200 placeholder:text-stone-400 focus:bg-white focus:ring-2 focus:ring-amber-500/50 focus:outline-none aria-invalid:ring-red-400 supports-[field-sizing:content]:resize-none"
            />
            {fieldErrors.content && (
              <p id={`${id}-content-error`} className="mt-1.5 text-sm text-red-700">
                {fieldErrors.content}
              </p>
            )}
          </div>
        </div>
      </form>
    </>
  )
}
