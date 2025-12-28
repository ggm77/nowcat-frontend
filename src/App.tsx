import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home';
import Admin from './pages/admin/Admin';
import Login from './pages/admin/Login';

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/admin">
          <Route index element={<Admin />} />
          <Route path="login" element={<Login />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
