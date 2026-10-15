# goodnote-web

goodnote-server 的 Web 前端。

- Vite 8 + React 19 + TypeScript
- React Router 8（純 SPA 路由）
- TanStack Query 5（請求、緩存、寫入後刷新）
- Tailwind CSS 4

## 本地運行

1. 在 goodnote-server 目錄啟動 Go 服務（監聽 :8080）：

   ```bash
   go run ./cmd/server
   ```

2. 在本目錄啟動前端：

   ```bash
   npm install
   npm run dev
   ```

3. 打開 http://localhost:5173

開發服務器會把 `/api` 代理到 `http://localhost:8080`（見 `vite.config.ts`），瀏覽器看來是同源請求，所以 Go 端不需要配置 CORS。Go 服務沒啟動時，頁面會提示「連不上 Go 服務」，啟動後切回頁面會自動刷新。

## 常用命令

| 命令 | 作用 |
|---|---|
| `npm run dev` | 啟動開發服務器 |
| `npm run build` | 類型檢查並打包到 `dist/` |
| `npm run lint` | 用 Oxlint 檢查代碼 |
| `npm run preview` | 本地預覽打包結果（同樣代理 `/api`） |

## 目錄結構

```
src/
├── main.tsx              入口：QueryClient + Router
├── router.tsx            路由表
├── lib/
│   ├── api.ts            fetch 封裝、ApiError、錯誤文案（之後在這裡帶 token）
│   └── queryClient.ts    TanStack Query 的默認配置
├── components/           通用組件：按鈕樣式、頁頭、錯誤提示、圖標
├── features/notes/       筆記（對應 Go 端的 internal/note）
│   ├── types.ts          和 Go 的 json tag 對應的類型
│   ├── api.ts            接口函數
│   ├── hooks.ts          useNotes、useNote、useCreateNote…
│   └── components/       列表、表單，以及加載中 / 不存在 / 出錯的狀態
└── routes/               頁面
```

## 路由

| 路徑 | 頁面 |
|---|---|
| `/notes` | 筆記列表（寬屏下右邊是空狀態） |
| `/notes/new` | 新建 |
| `/notes/:id` | 查看、刪除 |
| `/notes/:id/edit` | 編輯 |

窄屏下一次只顯示一欄：`/notes` 顯示列表，其他頁面顯示內容，頁頭左邊有返回按鈕。

## 和 Go 端的接口約定

| 接口 | 現狀 | 前端的假設 |
|---|---|---|
| `GET /api/v1/notes` | 已實現 | 返回 `Note[]` |
| `GET /api/v1/notes/:id` | 已實現 | 返回 `Note`，不存在時 404 |
| `POST /api/v1/notes` | 已實現 | 請求體 `{"title", "content"}`，返回 201 `{"id"}` |
| `PATCH /api/v1/notes/:id` | 返回 501 | 請求體只帶改了的字段 `{"title"?, "content"?}`；成功返回 2xx（約定 200 + 完整 Note），不存在時 404 |
| `DELETE /api/v1/notes/:id` | 返回 501 | 成功返回 2xx（約定 204），不存在時 404 |

錯誤體約定為 `{"error": "..."}`，前端也兼容 `{"message": "..."}` 和純文本。Go 端按上表實現 PATCH / DELETE 後，前端不用改就能直接用。
