import { Outlet } from "react-router-dom"

export default function App() {
  return (
    <div className="min-h-screen">
      <main
        className="min-h-[100svh] flex items-center justify-center"
        style={{
          paddingTop: "max(env(safe-area-inset-top), 12px)",
          paddingBottom: "max(env(safe-area-inset-bottom), 12px)",
        }}
      >
        <Outlet />
      </main>
    </div>
  )
}
