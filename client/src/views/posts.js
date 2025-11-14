import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./styles/posts.css";
import { authContext } from "../helpers/authContext";

function Posts() {
  let { id } = useParams();
  const [postData, setPostData] = useState({});
  const [comData, setComData] = useState([]);
  const [newComment, setNewComment] = useState("");
  const { authState } = useContext(authContext);
  useEffect(() => {
    axios.get(`http://localhost:5000/posts/byId/${id}`).then((response) => {
      setPostData(response.data);
    });
    axios.get(`http://localhost:5000/comments/${id}`).then((response) => {
      setComData(response.data);
    });
  }, []);
  const addComment = () => {
    if (newComment !== "") {
      axios
        .post(
          `http://localhost:3000/comments`,
          {
            commentBody: newComment,
            postId: id,
          },
          {
            headers: {
              accessToken: localStorage.getItem("accessToken"),
            },
          }
        )
        .then((response) => {
          if (response.data.error) {
            alert(response.data.error);
          } else {
            const comToAdd = {
              commentBody: newComment,
              userName: response.data.userName,
              id: response.data.id,
            };
            setComData([...comData, comToAdd]);
            setNewComment("");
          }
        });
    }
  };
  const deleteComment = (id) => {
    axios
      .delete(`http://localhost:3000/comments/${id}`, {
        headers: { accessToken: localStorage.getItem("accessToken") },
      })
      .then(() => {
        setComData(
          comData.filter((val) => {
            return val.id !== id;
          })
        );
      });
  };
  return (
    <div className="Posts">
      <div className="postSide">
        <h2>Post Section</h2>
        <div className="title">{postData.title}</div>
        <div className="postText">{postData.PostText}</div>
        <div className="userName">@{postData.userName}</div>
      </div>
      <div className="commentSide">
        <h2>Comment Section</h2>
        <div className="addComment">
          <input
            type="text"
            placeholder="Add Comment..."
            value={newComment}
            onChange={(event) => {
              setNewComment(event.target.value);
            }}
          />
          <button type="submit" onClick={addComment}>
            share
          </button>
        </div>
        <div className="comments">
          {comData.map((val, key) => {
            return (
              <div key={key}>
                <div className="user-comment">{val.commentBody}</div>
                <div className="user-name">@{val.userName}</div>
                {authState.userName === val.userName && (
                  <button
                    onClick={() => {
                      deleteComment(val.id);
                    }}
                    className="delete-btn"
                    aria-label={`Delete comment by ${val.userName}`}
                  >
                    ×
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Posts;
