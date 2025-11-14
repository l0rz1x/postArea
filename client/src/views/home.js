import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./styles/home.css";

function Home() {
  const [backendData, setBackendData] = useState([]);
  let navigate = useNavigate();
  useEffect(() => {
    axios.get("http://localhost:3000/posts").then((response) => {
      setBackendData(response.data);
    });
  }, []);

  const likeAPost = (postId) => {
    axios
      .post(
        "http://localhost:3000/like",
        { postId: postId },
        {
          headers: {
            accessToken: localStorage.getItem("accessToken"),
          },
        }
      )
      .then((response) => {
        setBackendData(
          backendData.map((post) => {
            if (post.id === postId) {
              if (response.data.liked) {
                return { ...post, likes: [...post.likes, 0] };
              } else {
                const likesArray = post.likes;
                likesArray.pop();
                return { ...post, likes: likesArray };
              }
            } else {
              return post;
            }
          })
        );
      });
  };
  return (
    <div className="Home">
      {backendData.map((val, key) => {
        return (
          <div className="post" key={key}>
            <div
              className="body"
              onClick={() => {
                navigate(`/posts/${val.id}`);
              }}
            >
              <h2 className="title">{val.title}</h2>
              {val.PostText}
            </div>
            <div className="footer">
              <div className="user">@{val.userName}</div>
              <div className="user">
                {new Date(val.createdAt).toUTCString()}
              </div>

              <div className="likes">
                <button
                  onClick={() => {
                    likeAPost(val.id);
                  }}
                >
                  ♥
                </button>
                <p>{val.likes.length}</p>
              </div>

              <div className="arrow">➜</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Home;
