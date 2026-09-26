import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, LogIn, UserPlus, X, MessageSquare, Heart, ShieldCheck } from "lucide-react";

export default function AuthPromptModal({ isOpen, onClose }) {
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop auth-prompt-backdrop" onClick={onClose}>
      <div
        className="modal-card auth-prompt-card"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <button
          type="button"
          className="modal-close-btn"
          onClick={onClose}
          aria-label="Close"
        >
          <X size={18} />
        </button>

        <div className="auth-prompt-icon-ring">
          <div className="auth-prompt-icon-inner">
            <Lock size={26} className="auth-prompt-icon" />
          </div>
        </div>

        <h2 className="auth-prompt-title">Sign in to Continue</h2>
        <p className="auth-prompt-subtitle">
          To read the full story, support the author, or join the community discussion,
          please sign in or create an account.
        </p>

        <div className="auth-prompt-perks">
          <div className="auth-perk-item">
            <div className="auth-perk-icon-wrap">
              <MessageSquare size={16} />
            </div>
            <span>Join discussions and share your perspective</span>
          </div>
          <div className="auth-perk-item">
            <div className="auth-perk-icon-wrap">
              <Heart size={16} />
            </div>
            <span>Like, support, and save inspiring posts</span>
          </div>
          <div className="auth-perk-item">
            <div className="auth-perk-icon-wrap">
              <ShieldCheck size={16} />
            </div>
            <span>Follow authors and curate your personal feed</span>
          </div>
        </div>

        <div className="auth-prompt-actions">
          <button
            type="button"
            className="btn btn-primary btn-lg auth-prompt-login-btn"
            onClick={() => {
              onClose();
              navigate("/login");
            }}
          >
            <LogIn size={18} />
            <span>Sign In</span>
          </button>
          <button
            type="button"
            className="btn btn-secondary btn-lg auth-prompt-register-btn"
            onClick={() => {
              onClose();
              navigate("/register");
            }}
          >
            <UserPlus size={18} />
            <span>Create Free Account</span>
          </button>
        </div>
      </div>
    </div>
  );
}
