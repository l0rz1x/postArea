import React from "react";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./styles/home.css";

function Home() {
  const [backendData, setBackendData] = useState([]);
  const [likedPosts, setLikedPosts] = useState([]);
  let navigate = useNavigate();
  useEffect(() => {
    if (!localStorage.getItem("accessToken")) {
      navigate("/login");
    } else {
      axios
        .get("https://postarea.onrender.com/posts", {
          headers: {
            accessToken: localStorage.getItem("accessToken"),
          },
        })
        .then((response) => {
          setBackendData(response.data.listOfPosts);
          setLikedPosts(
            response.data.likedPosts.map((like) => {
              return like.postId;
            })
          );
        });
    }
  }, []);

  const likeAPost = (postId) => {
    axios
      .post(
        "https://postarea.onrender.com/like",
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
                const newLikesArray = [...likesArray];
                newLikesArray.pop();
                return { ...post, likes: newLikesArray };
              }
            } else {
              return post;
            }
          })
        );
        if (likedPosts.includes(postId)) {
          setLikedPosts(
            likedPosts.filter((id) => {
              return id !== postId;
            })
          );
        } else {
          setLikedPosts([...likedPosts, postId]);
        }
      });
  };
  return (
    <div className="Home">
      {backendData.length === 0 ? (
        <div className="empty-state">
          <h1>No Posts Yet!</h1>
          <p>Be the first to share your thoughts.</p>
          <button
            className="create-post-button"
            onClick={() => {
              navigate("/create");
            }}
          >
            Create The First Post
          </button>
        </div>
      ) : (
        backendData.map((val, key) => {
          return (
            <div className="post" key={val.id}>
              <div
                className="body"
                onClick={() => {
                  navigate(`/posts/${val.id}`);
                }}
              >
                <h2 className="title">{val.title}</h2>
                <div className="post-text">{val.PostText}</div>
              </div>
              <div className="footer">
                <div className="user">
                  <Link to={`/profile/${val.UserId}`}>@{val.userName}</Link>
                </div>
                <div className="user">
                  {new Date(val.createdAt).toUTCString()}
                </div>

                <div className="likes">
                  <button
                    className={
                      likedPosts.includes(val.id) ? "liked" : "unliked"
                    }
                    onClick={() => {
                      likeAPost(val.id);
                    }}
                  >
                    ♥
                  </button>
                  <p>{val.likes.length}</p>
                </div>

                <div
                  className="arrow"
                  onClick={() => {
                    navigate(`/posts/${val.id}`);
                  }}
                >
                  ➜
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}

export default Home;
