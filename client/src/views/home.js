import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./styles/home.css";

function Home() {
  const [backendData, setBackendData] = useState([]);
  let navigate = useNavigate();
  useEffect(() => {
    axios.get("http://localhost:5000/posts").then((response) => {
      setBackendData(response.data);
    });
  }, []);
  return (
    <div className="Home">
      {backendData.map((val, key) => {
        return (
          <div
            className="post"
            key={key}
            onClick={() => {
              navigate(`/posts/${val.id}`);
            }}
          >
            <div className="title">{val.title}</div>
            <div className="body">{val.PostText}</div>
            <div className="footer">
              <div className="user">@{val.userName}</div>
              <div className="arrow">➜</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Home;
