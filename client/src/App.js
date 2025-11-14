import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import "./App.css";
import Home from "./views/home";
import Create from "./views/create";
import Posts from "./views/posts";
import Register from "./views/register";
import Login from "./views/login";
import { authContext } from "./helpers/authContext";
import axios from "axios";
function App() {
  const [authState, setAuthState] = useState({
    userName: "",
    id: 0,
    status: false,
  });
  useEffect(() => {
    axios
      .get("http://localhost:3000/auth/check", {
        headers: {
          accessToken: localStorage.getItem("accessToken"),
        },
      })
      .then((response) => {
        if (response.data.error) {
          setAuthState({ ...authState, status: false });
        } else {
          setAuthState({
            userName: response.data.userName,
            id: response.data.id,
            status: true,
          });
        }
      });
  }, []);
  const logout = () => {
    localStorage.removeItem("accessToken");
    setAuthState({
      userName: "",
      id: 0,
      status: false,
    });
  };
  return (
    <div className="App">
      <authContext.Provider value={{ authState, setAuthState }}>
        <Router>
          <div className="navbar">
            <Link to="/">Home Page</Link>
            {!authState.status ? (
              <>
                <Link to="/register">Register</Link>
                <Link to="/login">Login</Link>
              </>
            ) : (
              <>
                <Link to="/create">Create a Post</Link>
                <button onClick={logout}>Logout</button>
                <h1 className="username">@{authState.userName}</h1>
              </>
            )}
          </div>
          <Routes>
            <Route path="/" exact Component={Home} />
            <Route path="/create" exact Component={Create} />
            <Route path="/posts/:id" exact Component={Posts} />
            <Route path="/register" exact Component={Register} />
            <Route path="/login" exact Component={Login} />
          </Routes>
        </Router>
      </authContext.Provider>
    </div>
  );
}

export default App;
