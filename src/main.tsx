import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import './index.css'
import App from './App'
import Rsvp from './pages/Rsvp'

const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      // raíz -> redirige al RSVP
      { path: '/', element: <Navigate to="/rsvp" replace /> },
      // RSVP visible
      { path: '/rsvp', element: <Rsvp /> },
      // cualquier otra ruta -> RSVP
      { path: '*', element: <Navigate to="/rsvp" replace /> },
    ],
  },
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
