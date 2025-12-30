import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom'
import ReactGA from 'react-ga4';
import Home from './pages/Home';
import Admin from './pages/admin/Admin';
import Login from './pages/admin/Login';

const GA_TRACKING_ID = import.meta.env.VITE_GA_ID;

function App() {

  const location = useLocation();

  useEffect(() => {
    ReactGA.initialize(GA_TRACKING_ID);
  }, []);

  useEffect(() => {
    ReactGA.send({
      hitType: "pageview",
      page: location.pathname + location.search
    });
  }, [location]);

  return (
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/admin">
          <Route index element={<Admin />} />
          <Route path="login" element={<Login />} />
        </Route>
      </Routes>
  )
}

export default App
