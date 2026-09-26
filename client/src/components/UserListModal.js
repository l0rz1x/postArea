import React from "react";
import { Link } from "react-router-dom";
import { X, Users, UserCheck } from "lucide-react";

export default function UserListModal({
  isOpen,
  title = "Users",
  users = [],
  isLoading = false,
  onClose,
}) {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card user-list-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
          <X size={18} />
        </button>

        <div className="modal-header">
          <div className="modal-icon-wrapper modal-icon-blue">
            <Users size={22} />
          </div>
          <h3 className="modal-title">{title}</h3>
        </div>

        <div className="user-list-content">
          {isLoading ? (
            <div className="user-list-loading">
              <div className="spinner"></div>
            </div>
          ) : users.length === 0 ? (
            <div className="user-list-empty">
              <UserCheck size={36} className="text-muted mb-2" />
              <p className="text-muted">No users found.</p>
            </div>
          ) : (
            <div className="user-list-scroll">
              {users.map((u) => {
                const initial = u.userName ? u.userName.charAt(0).toUpperCase() : "U";
                return (
                  <Link
                    key={u.id}
                    to={`/profile/${u.id}`}
                    className="user-list-item"
                    onClick={onClose}
                  >
                    <div className="author-avatar">{initial}</div>
                    <div className="user-list-info">
                      <span className="user-list-name">@{u.userName}</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
