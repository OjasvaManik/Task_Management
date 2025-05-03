import {Outlet} from "react-router-dom";

function App() {

  return (
    <div className={'bg-gradient-to-b from-[#1e1e1e] to-[#111111] min-h-screen w-screen'}>
        <Outlet />
    </div>
  )
}

export default App
