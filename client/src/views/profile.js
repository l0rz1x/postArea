import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./styles/profile.css";

function Profile() {
  let { id } = useParams();
  let navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [userPostData, setUserPostData] = useState([]);
  useEffect(() => {
    axios.get(`http://localhost:3000/auth/info/${id}`).then((response) => {
      setUserName(response.data.userName);
    });
    axios.get(`http://localhost:3000/posts/byuserId/${id}`).then((response) => {
      setUserPostData(response.data);
    });
  }, []);
  return (
    <div className="profile-con">
      <div className="info">
        <div className="profil-username">username: {userName}</div>
      </div>

      <div className="listOf-posts">
        {userPostData.length === 0 ? (
          <h2 className="no-posts">no posts yet ...</h2>
        ) : (
          userPostData.map((val, key) => {
            return (
              <div className="my-posts" key={key}>
                <div
                  className="my-body"
                  onClick={() => {
                    navigate(`/posts/${val.id}`);
                  }}
                >
                  <h2 className="my-title">{val.title}</h2>
                  <div className="my-post-text">{val.PostText}</div>
                </div>
                <div className="my-footer">
                  <div className="my-user">@{val.userName}</div>
                  <div className="my-user">
                    {new Date(val.createdAt).toUTCString()}
                  </div>

                  <div className="my-likes">
                    <p>{val.likes.length}</p>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default Profile;
