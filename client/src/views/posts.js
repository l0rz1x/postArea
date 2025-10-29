import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./styles/posts.css";

import { useNavigate } from "react-router-dom";
function Posts() {
  let navigate = useNavigate();
  let { id } = useParams();
  const [postData, setPostData] = useState({});
  const [comData, setComData] = useState([]);
  const [newComment, setNewComment] = useState("");
  useEffect(() => {
    axios.get(`http://localhost:5000/posts/byId/${id}`).then((response) => {
      setPostData(response.data);
    });
    axios.get(`http://localhost:5000/comments/${id}`).then((response) => {
      setComData(response.data);
    });
  }, []);
  const addComment = () => {
    if (newComment != "") {
      axios
        .post(`http://localhost:3000/comments`, {
          commentBody: newComment,
          postId: id,
        })
        .then((response) => {
          const comToAdd = { commentBody: newComment };
          setComData([...comData, comToAdd]);
          setNewComment("");
        });
    }
  };
  return (
    <div className="Posts">
      <div className="postSide">
        <h2>Post Section</h2>
        <div className="title">{postData.title}</div>
        <div className="postText">{postData.PostText}</div>
        <div className="userName">{postData.userName}</div>
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
            return <div key={key}>{val.commentBody}</div>;
          })}
        </div>
      </div>
    </div>
  );
}

export default Posts;
