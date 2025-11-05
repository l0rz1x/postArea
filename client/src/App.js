import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";

import "./App.css";
import Home from "./views/home";
import Create from "./views/create";
import Posts from "./views/posts";
import Register from "./views/register";
import Login from "./views/login";

function App() {
  return (
    <div className="App">
      <Router>
        <div className="navbar">
          <Link to="/create">Create a Post</Link>
          <Link to="/">Home Page</Link>
          <Link to="/register">Register</Link>
          <Link to="/login">Login</Link>
        </div>
        <Routes>
          <Route path="/" exact Component={Home} />
          <Route path="/create" exact Component={Create} />
          <Route path="/posts/:id" exact Component={Posts} />
          <Route path="/register" exact Component={Register} />
          <Route path="/login" exact Component={Login} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
