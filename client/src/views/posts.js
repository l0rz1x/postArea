import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios';
import './styles/posts.css' 
function Posts() {
    let { id } = useParams();
    const [postData,setPostData] = useState({});
    useEffect(() => {
    axios.get(`http://localhost:5000/posts/byId/${id}`).then((response) => {
      setPostData(response.data)
    });
  }, []);
  return (
    <div className='Posts'>
      <div className='postSide'>
        <h2>Post Section</h2>
        <div className='title'>{postData.title}</div>
        <div className='postText'>{postData.PostText}</div>
        <div className='userName'>{postData.userName}</div>
      </div>
      <div className='commentSide'>
        <h2>Comment Section</h2>
        </div>
    </div>
  )
}

export default Posts