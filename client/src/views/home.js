import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"
import axios from "axios";
import "../App.css";

function Home() {
  const [backendData, setBackendData] = useState([]);
  let navigate = useNavigate();
  useEffect(() => {
    axios.get("http://localhost:5000/posts").then((response) => {
      setBackendData(response.data);
    });
  }, []);
  return (
    <div className="App">
      {backendData.map((val, key) => {
        return (
          <div className="post" key={key} onClick={() => {
            navigate(`/posts/${val.id}`)
          }}>
            <div className="title">{val.title}</div>
            <div className="body">{val.PostText}</div>
            <div className="footer">{val.userName}</div>
          </div>
        );
      })}
    </div>
  );
}

export default Home;
