import {Outlet} from "react-router-dom";

function App() {

  return (
    <div className={'bg-gradient-to-b from-gray-900 to-gray-700 min-h-screen w-screen'}>
        <Outlet />
    </div>
  )
}

export default App
