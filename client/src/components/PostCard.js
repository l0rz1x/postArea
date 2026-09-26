import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Heart, MessageSquare, ArrowRight, Trash2 } from "lucide-react";
import { formatRelativeTime } from "../utils/formatDate";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { likesApi } from "../api/likesApi";

export default function PostCard({
  post,
  isLikedInitial = false,
  onDeleteRequest,
  fromProfile = false,
  onGuestAction,
}) {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const toast = useToast();

  const [isLiked, setIsLiked] = useState(isLikedInitial);
  const [likesCount, setLikesCount] = useState(
    Array.isArray(post.likes) ? post.likes.length : 0
  );
  const [isLiking, setIsLiking] = useState(false);

  const commentsCount = Array.isArray(post.comments) ? post.comments.length : 0;
  const isAuthor = user && (user.id === post.UserId || user.userName === post.userName);

  const handleLike = async (e) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      if (onGuestAction) {
        onGuestAction();
      } else {
        toast.info("Please log in to like posts.");
        navigate("/login");
      }
      return;
    }

    if (isLiking) return;
    setIsLiking(true);

    // Optimistic UI update
    const previousLiked = isLiked;
    const previousCount = likesCount;
    setIsLiked(!previousLiked);
    setLikesCount((prev) => (previousLiked ? prev - 1 : prev + 1));

    try {
      const res = await likesApi.toggleLike(post.id);
      setIsLiked(res.liked);
      if (typeof res.likesCount === "number") {
        setLikesCount(res.likesCount);
      }
    } catch (err) {
      // Revert on failure
      setIsLiked(previousLiked);
      setLikesCount(previousCount);
      toast.error("Failed to update like status.");
    } finally {
      setIsLiking(false);
    }
  };

  const handleCardClick = (e) => {
    if (e && e.stopPropagation) {
      e.stopPropagation();
    }
    if (!isAuthenticated && onGuestAction) {
      onGuestAction();
      return;
    }
    navigate(`/posts/${post.id}`, { state: { fromProfile: Boolean(fromProfile) } });
  };

  const handleAuthorClick = (e) => {
    if (!isAuthenticated && onGuestAction) {
      e.preventDefault();
      e.stopPropagation();
      onGuestAction();
      return;
    }
  };

  const handleCommentClick = (e) => {
    if (!isAuthenticated && onGuestAction) {
      e.preventDefault();
      e.stopPropagation();
      onGuestAction();
      return;
    }
  };

  const hasFullName = Boolean(post.author?.fullName && post.author.fullName.trim());
  const displayName = hasFullName ? post.author.fullName.trim() : `@${post.userName}`;
  const isUsernameHidden = Boolean(hasFullName && post.author?.hideUsername);
  const authorInitial = (hasFullName ? post.author.fullName : post.userName || "U")
    .charAt(0)
    .toUpperCase();

  return (
    <article className="post-card" onClick={handleCardClick}>
      {/* Card Header */}
      <div className="post-card-header" onClick={(e) => e.stopPropagation()}>
        <Link
          to={isAuthenticated ? `/profile/${post.UserId}` : "#"}
          onClick={handleAuthorClick}
          className="post-author-info"
        >
          {post.author?.avatar ? (
            <img
              src={post.author.avatar}
              alt={displayName}
              className="author-avatar avatar-img"
            />
          ) : (
            <div className="author-avatar">{authorInitial}</div>
          )}
          <div className="author-details">
            <div className="author-name-stack">
              <span className="author-display-name">{displayName}</span>
              {hasFullName && !isUsernameHidden && (
                <span className="author-handle">@{post.userName}</span>
              )}
            </div>
            <span className="post-time">{formatRelativeTime(post.createdAt)}</span>
          </div>
        </Link>

        {isAuthor && onDeleteRequest && (
          <button
            className="btn-icon btn-icon-danger"
            onClick={(e) => {
              e.stopPropagation();
              onDeleteRequest(post);
            }}
            title="Delete post"
            aria-label="Delete post"
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>

      {/* Card Body */}
      <div className="post-card-body">
        <h3 className="post-title">{post.title}</h3>
        <p className="post-excerpt">{post.PostText}</p>
      </div>

      {/* Card Footer */}
      <div className="post-card-footer" onClick={(e) => e.stopPropagation()}>
        <div className="post-card-actions">
          {/* Like Button */}
          <button
            className={`action-pill like-pill ${isLiked ? "liked" : ""}`}
            onClick={handleLike}
            disabled={isLiking}
            aria-label={isLiked ? "Unlike post" : "Like post"}
          >
            <Heart size={16} className={`heart-icon ${isLiked ? "fill-current" : ""}`} />
            <span className="action-counter">{likesCount}</span>
          </button>

          {/* Comment Count Link */}
          <Link
            to={isAuthenticated ? `/posts/${post.id}` : "#"}
            onClick={handleCommentClick}
            state={{ fromProfile: Boolean(fromProfile) }}
            className="action-pill comment-pill"
          >
            <MessageSquare size={16} />
            <span className="action-counter">{commentsCount}</span>
          </Link>
        </div>

        {/* Read Post Link */}
        <button
          className="read-more-btn"
          onClick={handleCardClick}
          aria-label="View post details"
        >
          <span>Read</span>
          <ArrowRight size={14} />
        </button>
      </div>
    </article>
  );
}
