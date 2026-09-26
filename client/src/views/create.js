import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { PenSquare, Eye, ArrowLeft, Send } from "lucide-react";
import { postsApi } from "../api/postsApi";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

export default function Create() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const toast = useToast();
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  const initialValues = {
    title: "",
    PostText: "",
  };

  const validationSchema = Yup.object().shape({
    title: Yup.string()
      .min(3, "Title must be at least 3 characters")
      .max(120, "Title cannot exceed 120 characters")
      .required("Title is required"),
    PostText: Yup.string()
      .min(10, "Post content must be at least 10 characters")
      .max(5000, "Content cannot exceed 5000 characters")
      .required("Post content is required"),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      await postsApi.createPost(values);
      toast.success("Post published successfully!");
      navigate("/");
    } catch (err) {
      toast.error(err.message || "Failed to create post.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page-container create-post-page">
      <div className="composer-wrapper">
        {/* Top Header */}
        <div className="composer-header">
          <button
            type="button"
            className="back-link"
            onClick={() => navigate("/")}
          >
            <ArrowLeft size={16} />
            <span>Cancel</span>
          </button>

          <div className="preview-toggle-btns">
            <button
              type="button"
              className={`toggle-tab ${!isPreviewMode ? "active" : ""}`}
              onClick={() => setIsPreviewMode(false)}
            >
              <PenSquare size={16} />
              <span>Write</span>
            </button>
            <button
              type="button"
              className={`toggle-tab ${isPreviewMode ? "active" : ""}`}
              onClick={() => setIsPreviewMode(true)}
            >
              <Eye size={16} />
              <span>Preview</span>
            </button>
          </div>
        </div>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, isSubmitting, errors, touched }) => (
            <Form className="composer-form-card">
              <div className="composer-card-header">
                <h1 className="composer-title">Compose a Post</h1>
                <p className="composer-subtitle">
                  Share knowledge, ask thought-provoking questions, or start a discussion.
                </p>
              </div>

              {!isPreviewMode ? (
                <>
                  {/* Title Field */}
                  <div className="form-group">
                    <div className="form-label-row">
                      <label htmlFor="title" className="form-label">
                        Title
                      </label>
                      <span className="char-count">
                        {values.title.length}/120
                      </span>
                    </div>
                    <Field
                      id="title"
                      name="title"
                      type="text"
                      placeholder="e.g. Why modern architectures prioritize clean code"
                      className={`form-input ${
                        touched.title && errors.title ? "input-error" : ""
                      }`}
                    />
                    <ErrorMessage
                      name="title"
                      component="div"
                      className="form-error-msg"
                    />
                  </div>

                  {/* Body Content Field */}
                  <div className="form-group">
                    <div className="form-label-row">
                      <label htmlFor="PostText" className="form-label">
                        Post Content
                      </label>
                      <span className="char-count">
                        {values.PostText.length}/5000
                      </span>
                    </div>
                    <Field
                      as="textarea"
                      id="PostText"
                      name="PostText"
                      rows={10}
                      placeholder="Write your story, thoughts, or ideas here..."
                      className={`form-textarea ${
                        touched.PostText && errors.PostText ? "input-error" : ""
                      }`}
                    />
                    <ErrorMessage
                      name="PostText"
                      component="div"
                      className="form-error-msg"
                    />
                  </div>
                </>
              ) : (
                /* Live Preview Mode */
                <div className="composer-preview-pane">
                  <div className="preview-author-bar">
                    <div className="author-avatar">
                      {user?.userName ? user.userName.charAt(0).toUpperCase() : "U"}
                    </div>
                    <div>
                      <span className="author-name">@{user?.userName}</span>
                      <span className="post-meta-date">Draft Preview</span>
                    </div>
                  </div>
                  <h2 className="preview-post-title">
                    {values.title || "Your Post Title Will Appear Here"}
                  </h2>
                  <div className="preview-post-body">
                    {values.PostText || "Your post content preview will appear here."}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="composer-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => navigate("/")}
                  disabled={isSubmitting}
                >
                  Discard
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isSubmitting}
                >
                  <Send size={16} />
                  <span>{isSubmitting ? "Publishing..." : "Publish Post"}</span>
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
