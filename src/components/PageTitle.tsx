// React 19 會把組件裡渲染的 <title> 放進 <head>。同一時間只渲染一個。
export function PageTitle({ title }: { title: string }) {
  return <title>{`${title} · GoodNote`}</title>
}
