import { Outlet } from "react-router-dom";
import Navbar from "./components/navbar";

function App() {
  return (
    <div className="layout">
      <Navbar />
      <main>
        <Outlet />
      </main>
    </div>
  )
}

export default App
