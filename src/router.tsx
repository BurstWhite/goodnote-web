import { createBrowserRouter, Navigate } from 'react-router'
import { AppLayout } from './routes/AppLayout.tsx'
import { EditNote } from './routes/EditNote.tsx'
import { NewNote } from './routes/NewNote.tsx'
import { NoteDetail } from './routes/NoteDetail.tsx'
import { NotesIndex } from './routes/NotesIndex.tsx'
import { NotFound } from './routes/NotFound.tsx'
import { RouteError } from './routes/RouteError.tsx'

export const router = createBrowserRouter([
  {
    path: '/',
    ErrorBoundary: RouteError,
    children: [
      { index: true, element: <Navigate to="/notes" replace /> },
      {
        path: 'notes',
        Component: AppLayout,
        children: [
          { index: true, Component: NotesIndex },
          { path: 'new', Component: NewNote },
          { path: ':id', Component: NoteDetail },
          { path: ':id/edit', Component: EditNote },
        ],
      },
      { path: '*', Component: NotFound },
    ],
  },
])
