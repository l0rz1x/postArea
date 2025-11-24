import React, { useState, useContext } from "react";
import axios from "axios";
import "./styles/login.css";
import { useNavigate, Link } from "react-router-dom";
import { authContext } from "../helpers/authContext";

function Login() {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const { setAuthState } = useContext(authContext);
  const navigate = useNavigate();
  const login = () => {
    const data = { userName: userName, password: password };
    axios
      .post("https://postarea.onrender.com/auth/login", data)
      .then((response) => {
        if (response.data.error) {
          alert(response.data.error);
        } else {
          localStorage.setItem("accessToken", response.data.accessToken);
          setAuthState({
            userName: response.data.userName,
            id: response.data.id,
            status: true,
          });
          navigate("/");
        }
      });
  };
  return (
    <div className="Login">
      <h1 className="log-title">Login</h1>
      <div className="loginCon">
        <label htmlFor="log_username">Username: </label>
        <input
          id="log_username"
          type="text"
          placeholder="(Ex. user...)"
          onChange={(event) => {
            setUserName(event.target.value);
          }}
        />
        <label htmlFor="log-password">Password: </label>
        <input
          id="log-password"
          type="password"
          placeholder="(Ex. password...)"
          onChange={(event) => {
            setPassword(event.target.value);
          }}
        />
        <button onClick={login}>Login</button>
        <p>Dont have an account? {<Link to="/register">Register</Link>}</p>
      </div>
    </div>
  );
}

export default Login;
