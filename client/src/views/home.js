import React, { useState, useEffect, useCallback, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  PlusCircle,
  RefreshCw,
  MessageSquareDashed,
  Compass,
  Users,
} from "lucide-react";
import { postsApi } from "../api/postsApi";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import PostCard from "../components/PostCard";
import AuthPromptModal from "../components/AuthPromptModal";

export default function Home() {
  const navigate = useNavigate();
  const toast = useToast();
  const toastRef = useRef(toast);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    toastRef.current = toast;
  }, [toast]);

  const [activeFeed, setActiveFeed] = useState("explore"); // "explore" | "following"
  const [posts, setPosts] = useState([]);
  const [likedPostIds, setLikedPostIds] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthPromptOpen, setIsAuthPromptOpen] = useState(false);

  const fetchPosts = useCallback(async (feedType) => {
    setIsLoading(true);
    try {
      const data = await postsApi.getAllPosts(feedType);
      setPosts(data.listOfPosts || []);
      if (Array.isArray(data.likedPosts)) {
        setLikedPostIds(data.likedPosts.map((l) => l.postId));
      }
    } catch (err) {
      toastRef.current?.error(err.message || "Failed to load posts.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts(activeFeed);
  }, [activeFeed, fetchPosts]);

  const handleFollowingTabClick = () => {
    if (!isAuthenticated) {
      setIsAuthPromptOpen(true);
      return;
    }
    setActiveFeed("following");
  };

  return (
    <div className="page-container feed-page">
      {/* 1. Feed Navigation Tabs at the very TOP */}
      <div className="feed-top-bar">
        <div className="feed-tabs">
          <button
            className={`feed-tab ${activeFeed === "explore" ? "active" : ""}`}
            onClick={() => setActiveFeed("explore")}
          >
            <Compass size={18} />
            <span>Explore</span>
          </button>
          <button
            className={`feed-tab ${activeFeed === "following" ? "active" : ""}`}
            onClick={handleFollowingTabClick}
          >
            <Users size={18} />
            <span>Following</span>
          </button>
        </div>
      </div>

      {/* 2. Feed Header */}
      <div className="feed-header">
        <div className="feed-title-wrap">
          <h1 className="feed-title">
            {activeFeed === "explore" ? "Community Feed" : "Following Feed"}
          </h1>
          <p className="feed-subtitle">
            {activeFeed === "explore"
              ? "Discover fresh ideas and perspectives from everyone across PostArea."
              : "Latest posts from authors you follow."}
          </p>
        </div>

        <div className="feed-controls">
          <button
            className="btn btn-ghost btn-icon-only"
            onClick={() => fetchPosts(activeFeed)}
            title="Refresh feed"
            aria-label="Refresh feed"
          >
            <RefreshCw size={18} />
          </button>

          {isAuthenticated ? (
            <Link to="/create" className="btn btn-primary">
              <PlusCircle size={18} />
              <span>New Post</span>
            </Link>
          ) : (
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => setIsAuthPromptOpen(true)}
            >
              <PlusCircle size={18} />
              <span>New Post</span>
            </button>
          )}
        </div>
      </div>

      {/* 3. Feed Content */}
      {isLoading ? (
        <div className="post-grid">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="post-card-skeleton">
              <div className="skeleton-line skeleton-avatar-row">
                <div className="skeleton-circle"></div>
                <div className="skeleton-text-short"></div>
              </div>
              <div className="skeleton-line skeleton-title"></div>
              <div className="skeleton-line skeleton-paragraph"></div>
              <div className="skeleton-line skeleton-paragraph short"></div>
            </div>
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div className="empty-feed-card">
          <div className="empty-icon-wrap">
            {activeFeed === "following" ? (
              <Users size={48} />
            ) : (
              <MessageSquareDashed size={48} />
            )}
          </div>
          <h2 className="empty-title">
            {activeFeed === "following"
              ? "No posts from accounts you follow yet"
              : "No posts yet!"}
          </h2>
          <p className="empty-text">
            {activeFeed === "following"
              ? "Follow inspiring authors across PostArea to curate your personal feed, or discover content in the Explore feed."
              : "Be the first person in the community to spark a conversation."}
          </p>

          {activeFeed === "following" ? (
            <button
              className="btn btn-primary btn-lg"
              onClick={() => setActiveFeed("explore")}
            >
              <Compass size={18} />
              <span>Explore Community Feed</span>
            </button>
          ) : (
            <button
              className="btn btn-primary btn-lg"
              onClick={() => {
                if (!isAuthenticated) {
                  setIsAuthPromptOpen(true);
                } else {
                  navigate("/create");
                }
              }}
            >
              <PlusCircle size={18} />
              <span>Create the First Post</span>
            </button>
          )}
        </div>
      ) : (
        <div className="post-grid">
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              isLikedInitial={likedPostIds.includes(post.id)}
              onGuestAction={!isAuthenticated ? () => setIsAuthPromptOpen(true) : undefined}
            />
          ))}
        </div>
      )}

      {/* Auth Prompt Modal for guest interactions */}
      <AuthPromptModal
        isOpen={isAuthPromptOpen}
        onClose={() => setIsAuthPromptOpen(false)}
      />
    </div>
  );
}
