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
import PageNotFound from "./views/pageNotFound";
import Start from "./views/start";
import Profile from "./views/profile";
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
            {!authState.status ? (
              <>
                <Link to="/start">Home</Link>
                <Link to="/register">Register</Link>
                <Link to="/login">Login</Link>
              </>
            ) : (
              <>
                <Link to="/">Home Page</Link>
                <Link to="/create">Create a Post</Link>
                <button onClick={logout}>Logout</button>

                <Link
                  to={`/profile/${authState.id}`}
                  style={{
                    margin: 0,
                    padding: "8px 16px",
                    borderRadius: "999px",
                    fontSize: "15px",
                    fontWeight: "600",
                    color: "#0AA3A3",
                    background: "rgba(10, 163, 163, 0.08)",
                    border: "1px solid rgba(10, 163, 163, 0.12)",
                  }}
                >
                  @{authState.userName}
                </Link>
              </>
            )}
          </div>
          <Routes>
            <Route path="/" exact Component={Home} />
            <Route path="/start" exact Component={Start} />
            <Route path="/create" exact Component={Create} />
            <Route path="/posts/:id" exact Component={Posts} />
            <Route path="/register" exact Component={Register} />
            <Route path="/login" exact Component={Login} />
            <Route path="/profile/:id" exact Component={Profile} />
            <Route path="*" exact Component={PageNotFound} />
          </Routes>
        </Router>
      </authContext.Provider>
    </div>
  );
}

export default App;
