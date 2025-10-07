import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import App from './App'
import LandingClosed from './pages/LandingClosed'
import InvitationPage from './pages/InvitationPage'
import Rsvp from './pages/Rsvp'

const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      { path: '/', element: <LandingClosed /> },   // Landing con sobre cerrado
      { path: '/invitacion', element: <InvitationPage /> }, // Animación + extras
      { path: '/rsvp', element: <Rsvp /> },
    ],
  },
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
