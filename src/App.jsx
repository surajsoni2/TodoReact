import { Route, Routes, BrowserRouter as Router } from "react-router-dom";
import Home from "./pages/Home";
import Profile from "./pages/Profile"
import Register from "./pages/Register"
import Login from "./pages/Login"
import Header from "./components/Header";
import { Toaster } from "react-hot-toast";
import { useContext, useEffect } from "react";
import axios from "axios";
import { Context, server } from "./main";


function App() {

  const { setUser, setIsAuthenticated, setLoading,isAuthenticated } = useContext(Context)
  useEffect(() => {

    if (isAuthenticated){
    setLoading(true)
      
    axios.get(`${server}/users/me`,
    {
        withCredentials: true,
      })
      .then((res) => {
        setUser(res.data.user);
        setIsAuthenticated(true);
        setLoading(false)
      })
      .catch((e) => {
        setUser({})
        setIsAuthenticated(false);
        setLoading(false)
      })
    }
    }, [isAuthenticated])

  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
      <Toaster />
    </Router>
  )
}

export default App
