import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import './index.css'
import App from './App'
import Rsvp from './pages/Rsvp'
import Home from './pages/Home'

const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      // Home visible públicamente
      { path: '/', element: <Home /> },

      // RSVP visible
      { path: '/rsvp', element: <Rsvp /> },

      // cualquier otra ruta -> Home (o podrías mandarla a /rsvp si prefieres)
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
