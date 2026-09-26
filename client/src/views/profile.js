import React, { useEffect, useState, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  Calendar,
  FileText,
  Heart,
  PlusCircle,
  User,
  Users,
  UserPlus,
  UserCheck,
  UserMinus,
  Edit3,
  Lock,
} from "lucide-react";
import { authApi } from "../api/authApi";
import { postsApi } from "../api/postsApi";
import { followApi } from "../api/followApi";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { formatFullDate } from "../utils/formatDate";
import PostCard from "../components/PostCard";
import ConfirmModal from "../components/ConfirmModal";
import UserListModal from "../components/UserListModal";
import EditProfileModal from "../components/EditProfileModal";

export default function Profile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, updateUser } = useAuth();
  const toast = useToast();

  const [profile, setProfile] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Follow states
  const [isFollowing, setIsFollowing] = useState(false);
  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [isFollowLoading, setIsFollowLoading] = useState(false);
  const [isHoveringFollowing, setIsHoveringFollowing] = useState(false);

  // User List Modal states (for followers / following list)
  const [userListModalOpen, setUserListModalOpen] = useState(false);
  const [userListTitle, setUserListTitle] = useState("");
  const [userListData, setUserListData] = useState([]);
  const [isUserListLoading, setIsUserListLoading] = useState(false);

  // Edit Profile Modal states
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // Deletion modal
  const [postToDelete, setPostToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchProfileData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [profileData, postsData] = await Promise.all([
        authApi.getUserProfile(id),
        postsApi.getPostsByUserId(id),
      ]);
      setProfile(profileData);
      setUserPosts(postsData || []);
      setIsFollowing(!!profileData.isFollowing);
      setFollowerCount(profileData.followerCount || 0);
      setFollowingCount(profileData.followingCount || 0);
    } catch (err) {
      toast.error(err.message || "Failed to load profile.");
    } finally {
      setIsLoading(false);
    }
  }, [id, toast]);

  useEffect(() => {
    fetchProfileData();
  }, [fetchProfileData]);

  const handleToggleFollow = async () => {
    if (!isAuthenticated) {
      toast.info("Please sign in to follow creators.");
      navigate("/login");
      return;
    }

    if (isFollowLoading) return;
    setIsFollowLoading(true);

    const prevFollowing = isFollowing;
    const prevCount = followerCount;

    // Optimistic update
    setIsFollowing(!prevFollowing);
    setFollowerCount((prev) => (prevFollowing ? Math.max(0, prev - 1) : prev + 1));

    try {
      const res = await followApi.toggleFollow(id);
      setIsFollowing(res.following);
      if (typeof res.followerCount === "number") {
        setFollowerCount(res.followerCount);
      }
      toast.success(
        res.following
          ? `Now following @${profile?.userName}`
          : `Unfollowed @${profile?.userName}`
      );
    } catch (err) {
      // Revert on failure
      setIsFollowing(prevFollowing);
      setFollowerCount(prevCount);
      toast.error(err.message || "Failed to update follow status.");
    } finally {
      setIsFollowLoading(false);
    }
  };

  const handleSaveProfile = async ({ bio, avatar, fullName, hideUsername, isPrivate }) => {
    setIsSavingProfile(true);
    try {
      const res = await authApi.updateProfile({ bio, avatar, fullName, hideUsername, isPrivate });
      setProfile((prev) => ({
        ...prev,
        bio: res.user.bio,
        avatar: res.user.avatar,
        fullName: res.user.fullName,
        hideUsername: res.user.hideUsername,
        isPrivate: res.user.isPrivate,
      }));
      updateUser({
        bio: res.user.bio,
        avatar: res.user.avatar,
        fullName: res.user.fullName,
        hideUsername: res.user.hideUsername,
        isPrivate: res.user.isPrivate,
      });
      toast.success("Profile updated successfully!");
      setEditModalOpen(false);
    } catch (err) {
      toast.error(err.message || "Failed to update profile.");
    } finally {
      setIsSavingProfile(false);
    }
  };

  const openFollowersList = async () => {
    const isOwner = user && user.id === parseInt(id, 10);
    if (profile?.isPrivate && !isOwner && !isFollowing) {
      toast.info("This account is private. Only followers can view the followers list.");
      return;
    }
    setUserListTitle(`Followers of @${profile?.userName}`);
    setUserListModalOpen(true);
    setIsUserListLoading(true);
    try {
      const list = await followApi.getFollowers(id);
      setUserListData(list || []);
    } catch (err) {
      toast.error("Failed to load followers list.");
      setUserListData([]);
    } finally {
      setIsUserListLoading(false);
    }
  };

  const openFollowingList = async () => {
    const isOwner = user && user.id === parseInt(id, 10);
    if (profile?.isPrivate && !isOwner && !isFollowing) {
      toast.info("This account is private. Only followers can view the following list.");
      return;
    }
    setUserListTitle(`Accounts followed by @${profile?.userName}`);
    setUserListModalOpen(true);
    setIsUserListLoading(true);
    try {
      const list = await followApi.getFollowing(id);
      setUserListData(list || []);
    } catch (err) {
      toast.error("Failed to load following list.");
      setUserListData([]);
    } finally {
      setIsUserListLoading(false);
    }
  };

  const confirmDeletePost = async () => {
    if (!postToDelete) return;
    setIsDeleting(true);
    try {
      await postsApi.deletePost(postToDelete.id);
      setUserPosts((prev) => prev.filter((p) => p.id !== postToDelete.id));
      setProfile((prev) =>
        prev ? { ...prev, postCount: Math.max(0, prev.postCount - 1) } : prev
      );
      toast.success("Post deleted successfully.");
      setPostToDelete(null);
    } catch (err) {
      toast.error(err.message || "Failed to delete post.");
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="page-loader">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="page-container text-center">
        <h2>User profile not found.</h2>
        <Link to="/" className="btn btn-primary mt-4">
          Back to Feed
        </Link>
      </div>
    );
  }

  const isOwner = user && user.id === parseInt(id, 10);
  const avatarLetter = (profile.fullName ? profile.fullName.charAt(0) : profile.userName ? profile.userName.charAt(0) : "U").toUpperCase();

  return (
    <div className="page-container profile-page">
      {/* Profile Header Card */}
      <div className="profile-hero-card">
        <div className="profile-hero-top">
          <div className="profile-avatar-wrapper">
            {profile.avatar ? (
              <img
                src={profile.avatar}
                alt={profile.userName}
                className="profile-avatar-large avatar-img"
              />
            ) : (
              <div className="profile-avatar-large">{avatarLetter}</div>
            )}
          </div>

          <div className="profile-hero-details">
            <div className="profile-title-row">
              <div className="profile-name-block">
                {profile.fullName && (
                  <h1 className="profile-fullname">{profile.fullName}</h1>
                )}
                <span className="profile-username">
                  @{profile.userName}
                  {profile.hideUsername && isOwner && (
                    <span className="badge badge-primary badge-sm ml-2" title="Your handle is hidden in posts and comments">
                      Hidden Handle
                    </span>
                  )}
                  {profile.isPrivate && (
                    <span className="badge badge-warning badge-sm ml-2" title="This account is private">
                      🔒 Private Account
                    </span>
                  )}
                </span>
              </div>

              {/* Action Buttons: Edit if owner, Follow/Unfollow if other user */}
              <div className="profile-action-btn-wrap">
                {isOwner ? (
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => setEditModalOpen(true)}
                  >
                    <Edit3 size={15} />
                    <span>Edit Profile</span>
                  </button>
                ) : (
                  !isFollowing ? (
                    <button
                      className="btn btn-primary btn-follow"
                      onClick={handleToggleFollow}
                      disabled={isFollowLoading}
                    >
                      <UserPlus size={16} />
                      <span>{isFollowLoading ? "Loading..." : "Follow"}</span>
                    </button>
                  ) : (
                    <button
                      className={`btn btn-following ${isHoveringFollowing ? "btn-unfollow-hover" : ""}`}
                      onClick={handleToggleFollow}
                      onMouseEnter={() => setIsHoveringFollowing(true)}
                      onMouseLeave={() => setIsHoveringFollowing(false)}
                      disabled={isFollowLoading}
                    >
                      {isHoveringFollowing ? (
                        <>
                          <UserMinus size={16} />
                          <span>Unfollow</span>
                        </>
                      ) : (
                        <>
                          <UserCheck size={16} />
                          <span>Following</span>
                        </>
                      )}
                    </button>
                  )
                )}
              </div>
            </div>

            {profile.createdAt && (
              <div className="profile-joined-date">
                <Calendar size={14} />
                <span>Joined {formatFullDate(profile.createdAt)}</span>
              </div>
            )}

            {/* Bio Section */}
            {profile.bio ? (
              <p className="profile-bio-text">{profile.bio}</p>
            ) : isOwner ? (
              <button
                type="button"
                className="profile-add-bio-btn"
                onClick={() => setEditModalOpen(true)}
              >
                + Add a bio to introduce yourself
              </button>
            ) : null}
          </div>
        </div>

        {/* User Stats 2x2 Grid on mobile, 4 columns on desktop */}
        <div className="profile-stats-grid">
          {/* Posts Count */}
          <div className="stat-card">
            <div className="stat-icon-wrap stat-icon-blue">
              <FileText size={18} />
            </div>
            <div className="stat-details">
              <span className="stat-value">{profile.postCount ?? userPosts.length}</span>
              <span className="stat-label">Posts</span>
            </div>
          </div>

          {/* Likes Received */}
          <div className="stat-card">
            <div className="stat-icon-wrap stat-icon-rose">
              <Heart size={18} />
            </div>
            <div className="stat-details">
              <span className="stat-value">{profile.totalLikesReceived ?? 0}</span>
              <span className="stat-label">Likes</span>
            </div>
          </div>

          {/* Followers (Clickable) */}
          <div
            className="stat-card stat-card-interactive"
            onClick={openFollowersList}
            title="View followers"
          >
            <div className="stat-icon-wrap stat-icon-emerald">
              <Users size={18} />
            </div>
            <div className="stat-details">
              <span className="stat-value">{followerCount}</span>
              <span className="stat-label">Followers</span>
            </div>
          </div>

          {/* Following (Clickable) */}
          <div
            className="stat-card stat-card-interactive"
            onClick={openFollowingList}
            title="View following accounts"
          >
            <div className="stat-icon-wrap stat-icon-indigo">
              <UserCheck size={18} />
            </div>
            <div className="stat-details">
              <span className="stat-value">{followingCount}</span>
              <span className="stat-label">Following</span>
            </div>
          </div>
        </div>
      </div>

      {/* Posts Section */}
      <div className="profile-posts-section">
        <div className="section-header-bar">
          <h2 className="section-heading">
            <span>Posts by @{profile.userName}</span>
            <span className="badge badge-primary">{userPosts.length}</span>
          </h2>

          {isOwner && (
            <Link to="/create" className="btn btn-primary btn-sm">
              <PlusCircle size={16} />
              <span>Create Post</span>
            </Link>
          )}
        </div>

        {profile.isPrivate && !isOwner && !isFollowing ? (
          <div className="private-account-lock-card">
            <div className="lock-icon-circle">
              <Lock size={44} />
            </div>
            <h3 className="lock-card-title">This Account is Private</h3>
            <p className="lock-card-desc">
              Follow this account to see their posts and profile activity.
            </p>
          </div>
        ) : userPosts.length === 0 ? (
          <div className="empty-profile-posts">
            <User size={40} className="text-muted mb-2" />
            <h3>No posts published yet</h3>
            <p className="text-muted">
              {isOwner
                ? "You haven't posted anything yet. Share your first thought!"
                : `@${profile.userName} has not published any posts yet.`}
            </p>
            {isOwner && (
              <Link to="/create" className="btn btn-primary mt-4">
                <PlusCircle size={16} />
                <span>Write Your First Post</span>
              </Link>
            )}
          </div>
        ) : (
          <div className="post-grid">
            {userPosts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                fromProfile={true}
                onDeleteRequest={isOwner ? (targetPost) => setPostToDelete(targetPost) : undefined}
              />
            ))}
          </div>
        )}
      </div>

      {/* Delete Post Modal */}
      <ConfirmModal
        isOpen={!!postToDelete}
        title="Delete Post"
        message={`Are you sure you want to delete "${postToDelete?.title}"? This cannot be undone.`}
        confirmText="Yes, Delete"
        confirmVariant="danger"
        isLoading={isDeleting}
        onConfirm={confirmDeletePost}
        onClose={() => setPostToDelete(null)}
      />

      {/* Followers / Following List Modal */}
      <UserListModal
        isOpen={userListModalOpen}
        title={userListTitle}
        users={userListData}
        isLoading={isUserListLoading}
        onClose={() => setUserListModalOpen(false)}
      />

      {/* Edit Profile Modal (Name, Bio, Avatar & Privacy) */}
      <EditProfileModal
        isOpen={editModalOpen}
        currentFullName={profile.fullName || ""}
        currentBio={profile.bio || ""}
        currentAvatar={profile.avatar || ""}
        currentHideUsername={profile.hideUsername || false}
        currentIsPrivate={profile.isPrivate || false}
        userName={profile.userName}
        isLoading={isSavingProfile}
        onSave={handleSaveProfile}
        onClose={() => setEditModalOpen(false)}
      />
    </div>
  );
}
