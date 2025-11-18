import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./styles/posts.css";
import { authContext } from "../helpers/authContext";
import { Trash2, Send } from "lucide-react";

function Posts() {
  let { id } = useParams();
  let navigate = useNavigate();
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
  const deletePost = (id) => {
    axios
      .delete(`http://localhost:3000/posts/${id}`, {
        headers: { accessToken: localStorage.getItem("accessToken") },
      })
      .then((response) => {
        navigate("/");
      });
  };
  return (
    <div className="Posts">
      <div className="postSide">
        <h2 className="section-title">Post Content</h2>
        <div className="post-con">
          <div className="post-title">{postData.title}</div>
          <div className="postText">{postData.PostText}</div>
          <div className="userName">@{postData.userName}</div>
        </div>
        {authState.userName === postData.userName && (
          <button
            className="delete-post"
            onClick={() => deletePost(postData.id)}
          >
            <Trash2 className="icon-sm" />
          </button>
        )}
      </div>

      <div className="commentSide">
        <h2 className="section-title">Comments({comData.length})</h2>
        <div className="addComment">
          <input
            className="comment-input"
            type="text"
            placeholder="Add Comment..."
            value={newComment}
            onChange={(event) => {
              setNewComment(event.target.value);
            }}
          />
          <button
            type="submit"
            className="share-button"
            aria-label="Share Comment"
            onClick={addComment}
          >
            <Send className="icon-sm" />
          </button>
        </div>

        <div className="comments">
          {comData.length === 0 ? (
            <p className="no-comments">
              No comments yet. Be the first to share your thoughts!
            </p>
          ) : (
            comData.map((val, key) => {
              return (
                <div key={key} className="comment-item">
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
                      <Trash2 className="icon-xs" />
                    </button>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

export default Posts;
