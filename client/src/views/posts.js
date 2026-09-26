import React, { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useNavigate, useLocation, Link } from "react-router-dom";
import {
  ArrowLeft,
  Heart,
  MessageSquare,
  Trash2,
  Send,
  Calendar,
} from "lucide-react";
import { postsApi } from "../api/postsApi";
import { commentsApi } from "../api/commentsApi";
import { likesApi } from "../api/likesApi";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { formatRelativeTime, formatFullDate } from "../utils/formatDate";
import ConfirmModal from "../components/ConfirmModal";

export default function Posts() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated } = useAuth();
  const toast = useToast();

  const isFromProfile = Boolean(location.state?.fromProfile);
  const commentsSectionRef = useRef(null);
  const commentTextareaRef = useRef(null);

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  // Like state
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [isLiking, setIsLiking] = useState(false);

  // Deletion modals
  const [isPostDeleteOpen, setIsPostDeleteOpen] = useState(false);
  const [isDeletingPost, setIsDeletingPost] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);
  const [isDeletingComment, setIsDeletingComment] = useState(false);

  const fetchPostDetails = useCallback(async () => {
    setIsLoading(true);
    try {
      const [postData, commentsData] = await Promise.all([
        postsApi.getPostById(id),
        commentsApi.getCommentsByPostId(id),
      ]);
      setPost(postData);
      setComments(commentsData || []);

      const likesArr = postData.likes || [];
      setLikesCount(likesArr.length);
      if (user && likesArr.some((l) => (l.userId === user.id || l.UserId === user.id))) {
        setIsLiked(true);
      }
    } catch (err) {
      toast.error(err.message || "Failed to load post.");
      navigate("/");
    } finally {
      setIsLoading(false);
    }
  }, [id, user, navigate, toast]);

  useEffect(() => {
    fetchPostDetails();
  }, [fetchPostDetails]);

  const handleToggleLike = async () => {
    if (!isAuthenticated) {
      toast.info("Please log in to like this post.");
      navigate("/login");
      return;
    }

    if (isLiking) return;
    setIsLiking(true);

    const prevLiked = isLiked;
    const prevCount = likesCount;
    setIsLiked(!prevLiked);
    setLikesCount((prev) => (prevLiked ? prev - 1 : prev + 1));

    try {
      const res = await likesApi.toggleLike(id);
      setIsLiked(res.liked);
      if (typeof res.likesCount === "number") {
        setLikesCount(res.likesCount);
      }
    } catch (err) {
      setIsLiked(prevLiked);
      setLikesCount(prevCount);
      toast.error("Failed to update like status.");
    } finally {
      setIsLiking(false);
    }
  };

  const handleAddComment = async (e) => {
    if (e) e.preventDefault();
    if (!isAuthenticated) {
      toast.info("Please log in to leave a comment.");
      navigate("/login");
      return;
    }

    const trimmed = newComment.trim();
    if (!trimmed) {
      toast.error("Comment cannot be empty.");
      return;
    }

    setIsSubmittingComment(true);
    try {
      const created = await commentsApi.createComment({
        postId: id,
        commentBody: trimmed,
      });
      setComments((prev) => [...prev, created]);
      setNewComment("");
      toast.success("Comment added!");
    } catch (err) {
      toast.error(err.message || "Failed to add comment.");
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleScrollToComments = () => {
    if (commentsSectionRef.current) {
      commentsSectionRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    setTimeout(() => {
      if (commentTextareaRef.current) {
        commentTextareaRef.current.focus();
      }
    }, 350);
  };

  const handleConfirmDeletePost = async () => {
    setIsDeletingPost(true);
    try {
      await postsApi.deletePost(id);
      toast.success("Post deleted successfully.");
      navigate("/");
    } catch (err) {
      toast.error(err.message || "Failed to delete post.");
    } finally {
      setIsDeletingPost(false);
      setIsPostDeleteOpen(false);
    }
  };

  const handleConfirmDeleteComment = async () => {
    if (!commentToDelete) return;
    setIsDeletingComment(true);
    try {
      await commentsApi.deleteComment(commentToDelete.id);
      setComments((prev) => prev.filter((c) => c.id !== commentToDelete.id));
      toast.success("Comment removed.");
      setCommentToDelete(null);
    } catch (err) {
      toast.error(err.message || "Failed to remove comment.");
    } finally {
      setIsDeletingComment(false);
    }
  };

  if (isLoading) {
    return (
      <div className="page-loader">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!post) return null;

  const isPostAuthor = user && (user.id === post.UserId || user.userName === post.userName);
  const hasFullName = Boolean(post.author?.fullName && post.author.fullName.trim());
  const displayName = hasFullName ? post.author.fullName.trim() : `@${post.userName}`;
  const isUsernameHidden = Boolean(hasFullName && post.author?.hideUsername);
  const authorInitial = (hasFullName ? post.author.fullName : post.userName || "U")
    .charAt(0)
    .toUpperCase();

  return (
    <div className="page-container post-detail-page">
      {/* Navigation link */}
      <div className="detail-navigation">
        <Link
          to={isFromProfile && post ? `/profile/${post.UserId}` : "/"}
          className="back-link"
        >
          <ArrowLeft size={16} />
          <span>{isFromProfile ? "Back to Profile" : "Back to Feed"}</span>
        </Link>
      </div>

      <div className="detail-grid">
        {/* Main Post Section */}
        <section className="post-main-card">
          {/* Post Header */}
          <div className="post-detail-header">
            <Link to={`/profile/${post.UserId}`} className="post-detail-author">
              {post.author?.avatar ? (
                <img
                  src={post.author.avatar}
                  alt={displayName}
                  className="author-avatar avatar-lg avatar-img"
                />
              ) : (
                <div className="author-avatar avatar-lg">{authorInitial}</div>
              )}
              <div className="author-details">
                <div className="author-name-stack">
                  <span className="author-display-name">{displayName}</span>
                  {hasFullName && !isUsernameHidden && (
                    <span className="author-handle">@{post.userName}</span>
                  )}
                </div>
                <span className="post-meta-date" title={formatFullDate(post.createdAt)}>
                  <Calendar size={13} />
                  <span>{formatRelativeTime(post.createdAt)}</span>
                </span>
              </div>
            </Link>

            {isPostAuthor && isFromProfile && (
              <button
                className="btn btn-danger-soft btn-sm"
                onClick={() => setIsPostDeleteOpen(true)}
                title="Delete this post"
              >
                <Trash2 size={16} />
                <span>Delete</span>
              </button>
            )}
          </div>

          {/* Post Content */}
          <div className="post-detail-content">
            <h1 className="post-detail-title">{post.title}</h1>
            <div className="post-detail-body">{post.PostText}</div>
          </div>

          {/* Post Actions Bar */}
          <div className="post-detail-toolbar">
            <button
              className={`action-pill like-pill btn-lg-pill ${isLiked ? "liked" : ""}`}
              onClick={handleToggleLike}
              disabled={isLiking}
            >
              <Heart size={18} className={`heart-icon ${isLiked ? "fill-current" : ""}`} />
              <span className="action-counter">{likesCount} Likes</span>
            </button>

            <button
              type="button"
              className="action-pill comment-pill btn-lg-pill"
              onClick={handleScrollToComments}
              title="Scroll to comments"
            >
              <MessageSquare size={18} />
              <span className="action-counter">{comments.length} Comments</span>
            </button>
          </div>
        </section>

        {/* Discussion / Comments Section */}
        <section ref={commentsSectionRef} className="comments-section-card">
          <div className="comments-header">
            <div className="comments-title-wrap">
              <h2 className="comments-title">
                <span>Comments</span>
                <span className="comments-count-pill">{comments.length}</span>
              </h2>
            </div>
          </div>

          {/* Comment Composer */}
          <form className="comment-composer-box" onSubmit={handleAddComment}>
            <textarea
              ref={commentTextareaRef}
              className="comment-textarea"
              placeholder={
                isAuthenticated
                  ? "Share your thoughts..."
                  : "Please sign in to leave a comment."
              }
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              disabled={!isAuthenticated || isSubmittingComment}
              rows={3}
            />
            <div className="comment-composer-actions">
              <button
                type="submit"
                className="btn btn-primary btn-sm comment-submit-btn"
                disabled={!isAuthenticated || isSubmittingComment || !newComment.trim()}
              >
                <Send size={15} />
                <span>{isSubmittingComment ? "Posting..." : "Post Comment"}</span>
              </button>
            </div>
          </form>

          {/* Comments List */}
          <div className="comments-list">
            {comments.length === 0 ? (
              <div className="empty-comments-state">
                <div className="empty-comments-icon">
                  <MessageSquare size={28} />
                </div>
                <h4 className="empty-comments-heading">No comments yet</h4>
                <p className="empty-comments-text">
                  Be the first to share your thoughts and start the discussion!
                </p>
              </div>
            ) : (
              comments.map((comment) => {
                const cHasFullName = Boolean(comment.author?.fullName && comment.author.fullName.trim());
                const cDisplayName = cHasFullName ? comment.author.fullName.trim() : `@${comment.userName}`;
                const cHideUsername = Boolean(cHasFullName && comment.author?.hideUsername);
                const commentInitial = (cHasFullName ? comment.author.fullName : comment.userName || "U")
                  .charAt(0)
                  .toUpperCase();

                const isPostCreator =
                  (comment.author?.id && post.UserId && comment.author.id === post.UserId) ||
                  comment.userName === post.userName;

                const canDelete =
                  user &&
                  (user.userName === comment.userName ||
                    user.id === comment.userId ||
                    user.id === post.UserId);

                const authorProfileLink = comment.author?.id
                  ? `/profile/${comment.author.id}`
                  : comment.userId
                  ? `/profile/${comment.userId}`
                  : null;

                return (
                  <div key={comment.id} className="comment-item-card">
                    {/* Left: Avatar */}
                    <div className="comment-avatar-wrapper">
                      {authorProfileLink ? (
                        <Link to={authorProfileLink} className="comment-avatar-link">
                          {comment.author?.avatar ? (
                            <img
                              src={comment.author.avatar}
                              alt={cDisplayName}
                              className="comment-avatar-img"
                            />
                          ) : (
                            <div className="comment-avatar-letter">{commentInitial}</div>
                          )}
                        </Link>
                      ) : (
                        <div className="comment-avatar-letter">{commentInitial}</div>
                      )}
                    </div>

                    {/* Right: Content */}
                    <div className="comment-main-wrapper">
                      {/* Top Header Row */}
                      <div className="comment-top-row">
                        <div className="comment-author-meta">
                          {authorProfileLink ? (
                            <Link to={authorProfileLink} className="comment-author-name">
                              {cDisplayName}
                            </Link>
                          ) : (
                            <span className="comment-author-name">{cDisplayName}</span>
                          )}

                          {isPostCreator && (
                            <span className="comment-author-badge" title="Post Author">
                              Author
                            </span>
                          )}

                          {cHasFullName && !cHideUsername && (
                            <span className="comment-author-handle">@{comment.userName}</span>
                          )}

                          <span className="comment-bullet">·</span>

                          <span className="comment-time">
                            {formatRelativeTime(comment.createdAt)}
                          </span>
                        </div>

                        {canDelete && (
                          <button
                            type="button"
                            className="comment-delete-action"
                            onClick={() => setCommentToDelete(comment)}
                            title="Delete comment"
                            aria-label="Delete comment"
                          >
                            <Trash2 size={15} />
                          </button>
                        )}
                      </div>

                      {/* Comment Body */}
                      <div className="comment-text-body">
                        {comment.commentBody}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>
      </div>

      {/* Delete Post Modal */}
      <ConfirmModal
        isOpen={isPostDeleteOpen}
        title="Delete Post"
        message="Are you sure you want to permanently delete this post and all of its comments?"
        confirmText="Yes, Delete Post"
        confirmVariant="danger"
        isLoading={isDeletingPost}
        onConfirm={handleConfirmDeletePost}
        onClose={() => setIsPostDeleteOpen(false)}
      />

      {/* Delete Comment Modal */}
      <ConfirmModal
        isOpen={!!commentToDelete}
        title="Delete Comment"
        message="Are you sure you want to delete this comment?"
        confirmText="Delete"
        confirmVariant="danger"
        isLoading={isDeletingComment}
        onConfirm={handleConfirmDeleteComment}
        onClose={() => setCommentToDelete(null)}
      />
    </div>
  );
}
