import React, { useState, useEffect, useRef } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import {
  PlusCircle,
  LogOut,
  User,
  Menu,
  X,
  Compass,
  Home,
  LogIn,
  UserPlus,
  Search,
  ChevronDown,
} from "lucide-react";

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setDropdownOpen(false);
      }
    };
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [dropdownOpen]);

  const handleLogout = () => {
    logout();
    toast.info("Logged out successfully.");
    setMobileMenuOpen(false);
    setDropdownOpen(false);
    navigate("/landing");
  };

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <header className="navbar-header">
      <div className="navbar-container">
        {/* Brand Logo (No AI/Sparkles icon) */}
        <Link to={isAuthenticated ? "/" : "/landing"} className="navbar-brand" onClick={closeMobileMenu}>
          <span className="brand-text">
            Post<span>Area</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="navbar-nav desktop-nav">
          {!isAuthenticated ? (
            <>
              <NavLink
                to="/explore"
                className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
              >
                <Compass size={16} />
                <span>Explore</span>
              </NavLink>
              <NavLink
                to="/login"
                className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
              >
                <LogIn size={16} />
                <span>Login</span>
              </NavLink>
              <Link to="/register" className="btn btn-primary btn-sm">
                <UserPlus size={16} />
                <span>Get Started</span>
              </Link>
            </>
          ) : (
            <>
              <NavLink
                to="/"
                end
                className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
              >
                <Home size={16} />
                <span>Feed</span>
              </NavLink>

              <NavLink
                to="/search"
                className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
                title="Search posts and authors"
              >
                <Search size={16} />
                <span>Search</span>
              </NavLink>

              <NavLink
                to="/create"
                className={({ isActive }) =>
                  isActive ? "btn btn-primary btn-sm active" : "btn btn-primary btn-sm"
                }
              >
                <PlusCircle size={16} />
                <span>Create Post</span>
              </NavLink>

              {/* Profile Dropdown Menu Trigger */}
              <div className="nav-dropdown-wrapper" ref={dropdownRef}>
                <button
                  type="button"
                  className={`user-badge user-dropdown-trigger ${dropdownOpen ? "active" : ""}`}
                  onClick={() => setDropdownOpen((prev) => !prev)}
                  aria-expanded={dropdownOpen}
                  aria-haspopup="true"
                >
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.userName}
                      className="user-avatar-small avatar-nav-img"
                    />
                  ) : (
                    <div className="user-avatar-small">
                      {(user?.fullName ? user.fullName.charAt(0) : user?.userName ? user.userName.charAt(0) : "U").toUpperCase()}
                    </div>
                  )}
                  <span className="user-badge-name">
                    {user?.fullName || `@${user?.userName}`}
                  </span>
                  <ChevronDown
                    size={14}
                    className={`dropdown-chevron ${dropdownOpen ? "chevron-open" : ""}`}
                  />
                </button>

                {dropdownOpen && (
                  <div className="nav-dropdown-menu">
                    <div className="dropdown-user-header">
                      <div className="dropdown-user-avatar">
                        {user?.avatar ? (
                          <img src={user.avatar} alt={user.userName} className="avatar-img" />
                        ) : (
                          (user?.fullName ? user.fullName.charAt(0) : user?.userName ? user.userName.charAt(0) : "U").toUpperCase()
                        )}
                      </div>
                      <div className="dropdown-user-info">
                        {user?.fullName && (
                          <span className="dropdown-fullname">{user.fullName}</span>
                        )}
                        <span className="dropdown-username">@{user?.userName}</span>
                      </div>
                    </div>

                    <div className="dropdown-divider"></div>

                    <Link
                      to={`/profile/${user?.id}`}
                      className="dropdown-item"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <User size={16} />
                      <span>My Profile</span>
                    </Link>

                    <div className="dropdown-divider"></div>

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="dropdown-item dropdown-item-danger"
                    >
                      <LogOut size={16} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </nav>

        {/* Mobile Menu Toggle Button */}
        <button
          className="mobile-menu-toggle"
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-menu-drawer">
          <nav className="mobile-nav-links">
            {!isAuthenticated ? (
              <>
                <Link to="/explore" className="mobile-nav-link" onClick={closeMobileMenu}>
                  <Compass size={18} />
                  <span>Explore</span>
                </Link>
                <Link to="/login" className="mobile-nav-link" onClick={closeMobileMenu}>
                  <LogIn size={18} />
                  <span>Login</span>
                </Link>
                <Link to="/register" className="btn btn-primary w-full mt-2" onClick={closeMobileMenu}>
                  <UserPlus size={18} />
                  <span>Get Started</span>
                </Link>
              </>
            ) : (
              <>
                <Link to="/" className="mobile-nav-link" onClick={closeMobileMenu}>
                  <Home size={18} />
                  <span>Feed</span>
                </Link>
                <Link to="/search" className="mobile-nav-link" onClick={closeMobileMenu}>
                  <Search size={18} />
                  <span>Search</span>
                </Link>
                <Link to="/create" className="mobile-nav-link" onClick={closeMobileMenu}>
                  <PlusCircle size={18} />
                  <span>Create Post</span>
                </Link>
                <Link
                  to={`/profile/${user?.id}`}
                  className="mobile-nav-link"
                  onClick={closeMobileMenu}
                >
                  <User size={18} />
                  <span>My Profile ({user?.fullName || `@${user?.userName}`})</span>
                </Link>
                <div className="mobile-nav-divider"></div>
                <button
                  onClick={handleLogout}
                  className="mobile-nav-link text-danger w-full text-left"
                >
                  <LogOut size={18} />
                  <span>Sign Out</span>
                </button>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
