import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";

import "./App.css";
import Home from "./views/home";
import Create from "./views/create";
import Posts from "./views/posts";

function App() {
  return (
    <div className="App">
      <Router>
        <div className="navbar">
          <Link to="/create">Create a Post</Link>
          <Link to="/">Home Page</Link>
        </div>
        <Routes>
          <Route path="/" exact Component={Home} />
          <Route path="/create" exact Component={Create} />
          <Route path="/posts/:id" exact Component={Posts} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
