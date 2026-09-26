import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  Search as SearchIcon,
  X,
  MessageSquareDashed,
  Compass,
  User,
  Lock,
  ArrowRight,
} from "lucide-react";
import { postsApi } from "../api/postsApi";
import { authApi } from "../api/authApi";
import { useToast } from "../context/ToastContext";
import PostCard from "../components/PostCard";

export default function SearchPage() {
  const toast = useToast();

  const [posts, setPosts] = useState([]);
  const [likedPostIds, setLikedPostIds] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [matchingUsers, setMatchingUsers] = useState([]);
  const [isSearchingUsers, setIsSearchingUsers] = useState(false);

  const fetchAllPosts = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await postsApi.getAllPosts("explore");
      setPosts(data.listOfPosts || []);
      if (Array.isArray(data.likedPosts)) {
        setLikedPostIds(data.likedPosts.map((l) => l.postId));
      }
    } catch (err) {
      toast.error(err.message || "Failed to load posts.");
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchAllPosts();
  }, [fetchAllPosts]);

  const trimmedQuery = searchQuery.trim().toLowerCase();

  // Search users via backend API with strict privacy constraints
  useEffect(() => {
    if (!trimmedQuery) {
      setMatchingUsers([]);
      return;
    }

    let isMounted = true;
    const delayTimer = setTimeout(async () => {
      setIsSearchingUsers(true);
      try {
        const users = await authApi.searchUsers(trimmedQuery);
        if (isMounted) {
          const seen = new Set();
          const uniqueUsers = (users || []).filter((u) => {
            const key = u.id || u.userName?.toLowerCase();
            if (!key || seen.has(key)) return false;
            seen.add(key);
            return true;
          });
          setMatchingUsers(uniqueUsers);
        }
      } catch (err) {
        if (isMounted) {
          setMatchingUsers([]);
        }
      } finally {
        if (isMounted) {
          setIsSearchingUsers(false);
        }
      }
    }, 250);

    return () => {
      isMounted = false;
      clearTimeout(delayTimer);
    };
  }, [trimmedQuery]);

  // Filter posts based on title, content, or author's name / handle (respecting hideUsername)
  const matchingPosts = trimmedQuery
    ? posts.filter((post) => {
        const titleMatch = post.title?.toLowerCase().includes(trimmedQuery);
        const textMatch = post.PostText?.toLowerCase().includes(trimmedQuery);
        const fullNameMatch = post.author?.fullName?.toLowerCase().includes(trimmedQuery);
        // If author hid username, searching by username should NOT match their posts
        const userNameMatch =
          !post.author?.hideUsername && post.userName?.toLowerCase().includes(trimmedQuery);

        return titleMatch || textMatch || fullNameMatch || userNameMatch;
      })
    : [];

  const totalResults = matchingUsers.length + matchingPosts.length;

  return (
    <div className="page-container search-page">
      {/* Search Page Header */}
      <div className="search-header-card">
        <h1 className="search-page-title">Search</h1>
        <p className="search-page-subtitle">
          Find interesting posts, discussions, ideas, or creators across the community.
        </p>

        <div className="search-large-box">
          <SearchIcon size={20} className="search-large-icon" />
          <input
            type="text"
            className="search-large-input"
            placeholder="Type names, topics, keywords or @username..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoFocus
          />
          {searchQuery && (
            <button
              type="button"
              className="search-clear-btn"
              onClick={() => setSearchQuery("")}
              aria-label="Clear search query"
            >
              <X size={18} />
            </button>
          )}
        </div>
      </div>

      {/* Search Results Area */}
      <div className="search-results-section">
        {isLoading ? (
          <div className="post-grid">
            {[1, 2, 3].map((n) => (
              <div key={n} className="post-card-skeleton">
                <div className="skeleton-line skeleton-avatar-row">
                  <div className="skeleton-circle"></div>
                  <div className="skeleton-text-short"></div>
                </div>
                <div className="skeleton-line skeleton-title"></div>
                <div className="skeleton-line skeleton-paragraph"></div>
              </div>
            ))}
          </div>
        ) : !trimmedQuery ? (
          <div className="search-empty-prompt">
            <div className="empty-icon-wrap icon-indigo">
              <Compass size={44} />
            </div>
            <h3>Discover Stories & Discussions</h3>
            <p className="text-muted">
              Start typing above to search across titles, thoughts, and community members.
            </p>
          </div>
        ) : totalResults === 0 && !isSearchingUsers ? (
          <div className="empty-feed-card">
            <div className="empty-icon-wrap">
              <MessageSquareDashed size={48} />
            </div>
            <h2 className="empty-title">No results found</h2>
            <p className="empty-text">
              We couldn't find any profiles or posts matching "{searchQuery}". Try different keywords or check spelling.
            </p>
            <button className="btn btn-secondary" onClick={() => setSearchQuery("")}>
              Clear Search
            </button>
          </div>
        ) : (
          <div>
            <div className="search-results-meta">
              <span>
                Found <strong>{totalResults}</strong> result{totalResults !== 1 ? "s" : ""} for "
                <em>{searchQuery}</em>"
              </span>
            </div>

            {/* Profiles / People Section */}
            {matchingUsers.length > 0 && (
              <div className="search-section-group mb-5">
                <h2 className="search-section-heading">
                  <User size={18} />
                  <span>Profiles ({matchingUsers.length})</span>
                </h2>
                <div className="search-profiles-grid">
                  {matchingUsers.map((u) => {
                    const avatarLetter = (u.fullName ? u.fullName.charAt(0) : u.userName.charAt(0)).toUpperCase();
                    return (
                      <Link
                        key={u.id}
                        to={`/profile/${u.id}`}
                        className="profile-search-card"
                      >
                        <div className="profile-search-avatar-wrap">
                          {u.avatar ? (
                            <img
                              src={u.avatar}
                              alt={u.fullName || u.userName}
                              className="profile-search-avatar avatar-img"
                            />
                          ) : (
                            <div className="profile-search-avatar">{avatarLetter}</div>
                          )}
                        </div>
                        <div className="profile-search-info">
                          <div className="profile-search-name-row">
                            <span className="profile-search-fullname">
                              {u.fullName || `@${u.userName}`}
                            </span>
                            {u.isPrivate && (
                              <span className="badge badge-warning badge-sm" title="Private Account">
                                <Lock size={11} />
                                <span>Private</span>
                              </span>
                            )}
                          </div>
                          {!u.hideUsername && u.fullName && (
                            <span className="profile-search-handle">@{u.userName}</span>
                          )}
                          {u.bio && (
                            <p className="profile-search-bio">{u.bio}</p>
                          )}
                        </div>
                        <div className="profile-search-action">
                          <span className="btn btn-secondary btn-sm">
                            <span>View</span>
                            <ArrowRight size={13} />
                          </span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Posts Section */}
            {matchingPosts.length > 0 && (
              <div className="search-section-group">
                <h2 className="search-section-heading">
                  <span>Posts ({matchingPosts.length})</span>
                </h2>
                <div className="post-grid">
                  {matchingPosts.map((post) => (
                    <PostCard
                      key={post.id}
                      post={post}
                      isLikedInitial={likedPostIds.includes(post.id)}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
