import React from 'react'
import {Route, Routes} from 'react-router-dom';
import Chat from './Pages/Chat.jsx';
import Login from './Pages/Login.jsx';
function App() {
  return (
    <div className='App'>
      <Routes>
        <Route path="/" element={<Login />} exact/>
        <Route path="/chat" element={<Chat />} />
      </Routes>
    </div>
  )
}

export default App;