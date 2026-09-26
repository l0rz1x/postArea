import React from "react";
import { Link } from "react-router-dom";
import {
  MessageSquare,
  Heart,
  Shield,
  ArrowRight,
  Compass,
  Users,
  Eye,
  Zap,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Landing() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="landing-page">
      {/* 1. Hero Section */}
      <section className="hero-section">
        <h1 className="hero-title">
          Share Your Thoughts,{" "}
          <span className="gradient-text">Grow With the Community.</span>
        </h1>

        <p className="hero-description">
          <strong>PostArea</strong> is where authentic voices, inspiring ideas, and
          engaging discussions meet. Explore topics that matter to you, follow great writers,
          and share your perspective with the world.
        </p>

        <div className="hero-actions">
          {isAuthenticated ? (
            <Link to="/" className="btn btn-primary btn-lg">
              <Compass size={18} />
              <span>Go to Feed</span>
              <ArrowRight size={18} />
            </Link>
          ) : (
            <>
              <Link to="/register" className="btn btn-primary btn-lg hero-cta-btn">
                <span>Join PostArea Free</span>
                <ArrowRight size={18} />
              </Link>
              <Link to="/explore" className="btn btn-secondary btn-lg hero-explore-btn">
                <Compass size={18} />
                <span>Explore Posts</span>
              </Link>
            </>
          )}
        </div>
      </section>

      {/* 2. Live Platform Preview Section */}
      <section className="landing-preview-section">
        <div className="landing-preview-card">
          <div className="landing-preview-header">
            <div className="landing-preview-author">
              <div className="preview-avatar">S</div>
              <div className="preview-author-meta">
                <div className="preview-author-name-row">
                  <span className="preview-author-name">Snow Blue</span>
                  <span className="preview-author-badge">Author</span>
                  <span className="preview-author-handle">@user123</span>
                </div>
                <span className="preview-time">2 hours ago</span>
              </div>
            </div>
            <span className="preview-topic-tag">Tech & Ideas</span>
          </div>

          <div className="landing-preview-body">
            <h3 className="preview-post-title">
              The future of community-driven platforms and independent writing
            </h3>
            <p className="preview-post-text">
              When sharing ideas, growing with real people rather than algorithms is priceless.
              On PostArea, everyone can find their authentic voice in a clean, distraction-free
              and friendly environment...
            </p>
          </div>

          <div className="landing-preview-footer">
            <div className="preview-actions">
              <div className="preview-action-item action-liked">
                <Heart size={16} className="fill-current" />
                <span>24 Likes</span>
              </div>
              <div className="preview-action-item">
                <MessageSquare size={16} />
                <span>8 Comments</span>
              </div>
              <div className="preview-action-item">
                <Eye size={16} />
                <span>340 Reads</span>
              </div>
            </div>
            <Link to="/explore" className="preview-explore-link">
              <span>Explore Live Feed</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* 3. Feature Highlights Grid */}
      <section className="landing-features-section">
        <div className="section-heading-wrap">
          <h2 className="landing-section-title">Why PostArea?</h2>
          <p className="landing-section-subtitle">
            Modern social sharing crafted to be clean, private, and productive.
          </p>
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon icon-indigo">
              <MessageSquare size={22} />
            </div>
            <h3 className="feature-title">Vibrant Discussions</h3>
            <p className="feature-text">
              Dive deep into meaningful conversations, get genuine feedback, and interact
              with fellow thinkers in real time.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon icon-rose">
              <Shield size={22} />
            </div>
            <h3 className="feature-title">Privacy & Full Control</h3>
            <p className="feature-text">
              Keep your profile private, hide your username handle, or share publicly. You are
              in complete control of your presence.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon icon-emerald">
              <Users size={22} />
            </div>
            <h3 className="feature-title">Curated Following Feed</h3>
            <p className="feature-text">
              Follow inspiring creators and thinkers to build a personalized stream focused purely
              on voices you care about.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon icon-amber">
              <Zap size={22} />
            </div>
            <h3 className="feature-title">Lightning Fast & Clean</h3>
            <p className="feature-text">
              Free from distractions and clutter, engineered for pure reading, writing, and
              connecting pleasure.
            </p>
          </div>
        </div>
      </section>

      {/* 4. Statistics Banner */}
      <section className="landing-stats-section">
        <div className="landing-stats-grid">
          <div className="landing-stat-card">
            <span className="stat-number">100+</span>
            <span className="stat-label">Stories Shared</span>
          </div>
          <div className="landing-stat-card">
            <span className="stat-number">50+</span>
            <span className="stat-label">Active Members</span>
          </div>
          <div className="landing-stat-card">
            <span className="stat-number">100%</span>
            <span className="stat-label">Open & Free Space</span>
          </div>
          <div className="landing-stat-card">
            <span className="stat-number">24/7</span>
            <span className="stat-label">Live Discussions</span>
          </div>
        </div>
      </section>

      {/* 5. How It Works Steps */}
      <section className="landing-steps-section">
        <div className="section-heading-wrap">
          <h2 className="landing-section-title">How It Works</h2>
          <p className="landing-section-subtitle">
            Three simple steps to join and thrive in the PostArea community.
          </p>
        </div>

        <div className="landing-steps-grid">
          <div className="landing-step-card">
            <div className="step-badge">1</div>
            <h3 className="step-title">Create Your Profile</h3>
            <p className="step-text">
              Sign up in less than a minute, set up your avatar and bio to introduce yourself.
            </p>
          </div>

          <div className="landing-step-card">
            <div className="step-badge">2</div>
            <h3 className="step-title">Share Your Thoughts</h3>
            <p className="step-text">
              Publish your ideas, experiences, stories, or questions with a simple, modern editor.
            </p>
          </div>

          <div className="landing-step-card">
            <div className="step-badge">3</div>
            <h3 className="step-title">Connect & Engage</h3>
            <p className="step-text">
              Discover inspiring authors, like posts, join discussions with comments, and build connections.
            </p>
          </div>
        </div>
      </section>

      {/* 6. Bottom Call To Action Banner */}
      {!isAuthenticated && (
        <section className="landing-cta-section">
          <div className="landing-cta-banner">
            <h2 className="cta-banner-title">
              Ready to Share Your Voice?
            </h2>
            <p className="cta-banner-text">
              Join PostArea today and become part of a passionate, growing community of thinkers.
            </p>
            <div className="cta-banner-actions">
              <Link to="/register" className="btn btn-primary btn-lg cta-primary-btn">
                <span>Get Started Free</span>
                <ArrowRight size={18} />
              </Link>
              <Link to="/login" className="btn btn-secondary btn-lg cta-secondary-btn">
                <span>Sign In to Your Account</span>
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
