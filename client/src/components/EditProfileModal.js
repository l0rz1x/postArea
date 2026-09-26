import React, { useState, useEffect } from "react";
import { X, User, Image, Save } from "lucide-react";

export default function EditProfileModal({
  isOpen,
  currentFullName = "",
  currentBio = "",
  currentAvatar = "",
  currentHideUsername = false,
  currentIsPrivate = false,
  userName = "",
  onSave,
  onClose,
  isLoading = false,
}) {
  const [fullName, setFullName] = useState("");
  const [bio, setBio] = useState("");
  const [avatar, setAvatar] = useState("");
  const [hideUsername, setHideUsername] = useState(false);
  const [isPrivate, setIsPrivate] = useState(false);
  const [avatarError, setAvatarError] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFullName(currentFullName || "");
      setBio(currentBio || "");
      setAvatar(currentAvatar || "");
      setHideUsername(Boolean(currentHideUsername));
      setIsPrivate(Boolean(currentIsPrivate));
      setAvatarError(false);
    }
  }, [isOpen, currentFullName, currentBio, currentAvatar, currentHideUsername, currentIsPrivate]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const canHide = Boolean(fullName.trim());
    onSave({
      fullName: fullName.trim(),
      bio: bio.trim(),
      avatar: avatar.trim(),
      hideUsername: canHide ? hideUsername : false,
      isPrivate: Boolean(isPrivate),
    });
  };

  const initialLetter = (fullName.trim() || userName || "U").charAt(0).toUpperCase();

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card edit-profile-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
          <X size={18} />
        </button>

        <div className="modal-header">
          <div className="modal-icon-wrapper modal-icon-blue">
            <User size={22} />
          </div>
          <h3 className="modal-title">Edit Profile</h3>
        </div>

        <form onSubmit={handleSubmit} className="edit-profile-form">
          {/* Full Name */}
          <div className="form-group">
            <label htmlFor="edit-fullname" className="form-label">
              Full Name
            </label>
            <input
              id="edit-fullname"
              type="text"
              placeholder="e.g. John Doe"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="form-input"
            />
          </div>

          {/* Privacy Toggle: Hide Username */}
          <div className="form-group privacy-settings-group">
            <label className="checkbox-card-label" htmlFor="hide-username-checkbox">
              <input
                id="hide-username-checkbox"
                type="checkbox"
                checked={hideUsername && Boolean(fullName.trim())}
                disabled={!fullName.trim()}
                onChange={(e) => setHideUsername(e.target.checked)}
                className="styled-checkbox"
              />
              <div className="checkbox-text-block">
                <span className="checkbox-main-title">
                  Hide Username (@{userName})
                </span>
                <span className="checkbox-sub-desc">
                  {!fullName.trim() ? (
                    <span className="text-warning">
                      ⚠️ Please enter a Full Name before hiding your username.
                    </span>
                  ) : (
                    "Your @handle will be hidden in posts and comments; only your Full Name will be displayed."
                  )}
                </span>
              </div>
            </label>
          </div>

          {/* Privacy Toggle: Make Account Private */}
          <div className="form-group privacy-settings-group">
            <label className="checkbox-card-label" htmlFor="private-account-checkbox">
              <input
                id="private-account-checkbox"
                type="checkbox"
                checked={isPrivate}
                onChange={(e) => setIsPrivate(e.target.checked)}
                className="styled-checkbox"
              />
              <div className="checkbox-text-block">
                <span className="checkbox-main-title">
                  🔒 Private Account
                </span>
                <span className="checkbox-sub-desc">
                  When your account is private, your posts won't appear in Explore. Only people who follow you can view your profile, posts, and followers list.
                </span>
              </div>
            </label>
          </div>

          {/* Avatar Preview & URL */}
          <div className="avatar-edit-section">
            <div className="avatar-preview-wrap">
              {avatar && !avatarError ? (
                <img
                  src={avatar}
                  alt={userName}
                  className="profile-avatar-large avatar-img"
                  onError={() => setAvatarError(true)}
                />
              ) : (
                <div className="profile-avatar-large">{initialLetter}</div>
              )}
            </div>

            <div className="form-group flex-1">
              <label htmlFor="avatar-url" className="form-label">
                Avatar Image URL
              </label>
              <div className="input-with-icon">
                <Image size={16} className="input-icon-left" />
                <input
                  id="avatar-url"
                  type="url"
                  placeholder="https://example.com/avatar.jpg"
                  value={avatar}
                  onChange={(e) => {
                    setAvatar(e.target.value);
                    setAvatarError(false);
                  }}
                  className="form-input has-icon-left"
                />
              </div>
              <span className="form-hint">Paste a link to any PNG/JPG photo.</span>
            </div>
          </div>

          {/* Bio Textarea */}
          <div className="form-group mt-3">
            <div className="form-label-row">
              <label htmlFor="bio-text" className="form-label">
                Bio
              </label>
              <span className={`char-count ${bio.length > 250 ? "text-danger" : ""}`}>
                {bio.length}/250
              </span>
            </div>
            <textarea
              id="bio-text"
              rows={3}
              placeholder="Tell the community about yourself, your interests, or what you write about..."
              value={bio}
              onChange={(e) => setBio(e.target.value.slice(0, 250))}
              className="form-textarea"
            />
          </div>

          {/* Modal Actions */}
          <div className="modal-actions mt-4">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading || bio.length > 250}
            >
              <Save size={16} />
              <span>{isLoading ? "Saving..." : "Save Changes"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
