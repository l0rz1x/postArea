import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { User, UserCheck, Lock, Eye, EyeOff, UserPlus } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

export default function Register() {
  const navigate = useNavigate();
  const toast = useToast();
  const { register } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const initialValues = {
    fullName: "",
    userName: "",
    password: "",
  };

  const validationSchema = Yup.object().shape({
    fullName: Yup.string()
      .min(2, "Full name must be at least 2 characters")
      .max(60, "Full name cannot exceed 60 characters")
      .required("Full name (First and Last name) is required"),
    userName: Yup.string()
      .min(3, "Username must be at least 3 characters")
      .max(20, "Username cannot exceed 20 characters")
      .matches(/^[a-zA-Z0-9_-]+$/, "Only letters, numbers, hyphens and underscores allowed")
      .required("Username is required"),
    password: Yup.string()
      .min(4, "Password must be at least 4 characters")
      .max(30, "Password cannot exceed 30 characters")
      .required("Password is required"),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      await register(values.userName.trim(), values.password, values.fullName.trim());
      toast.success(`Welcome to PostArea, ${values.fullName.trim()}!`);
      navigate("/", { replace: true });
    } catch (err) {
      toast.error(err.message || "Failed to create account.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        {/* Card Header */}
        <div className="auth-header">
          <div className="auth-brand-badge">
            <UserPlus size={22} />
          </div>
          <h1 className="auth-title">Create Account</h1>
          <p className="auth-subtitle">
            Join the PostArea community to share and discuss ideas
          </p>
        </div>

        {/* Form */}
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, touched, errors }) => (
            <Form className="auth-form">
              {/* Full Name Field */}
              <div className="form-group">
                <label className="form-label" htmlFor="reg-fullname">
                  Full Name (First & Last Name) <span className="text-danger">*</span>
                </label>
                <div className="input-with-icon">
                  <UserCheck size={18} className="input-icon-left" />
                  <Field
                    id="reg-fullname"
                    name="fullName"
                    type="text"
                    placeholder="e.g. John Doe"
                    className={`form-input has-icon-left ${
                      touched.fullName && errors.fullName ? "input-error" : ""
                    }`}
                    autoComplete="name"
                  />
                </div>
                <ErrorMessage
                  name="fullName"
                  component="div"
                  className="form-error-msg"
                />
              </div>

              {/* Username Field */}
              <div className="form-group">
                <label className="form-label" htmlFor="reg-username">
                  Username <span className="text-danger">*</span>
                </label>
                <div className="input-with-icon">
                  <User size={18} className="input-icon-left" />
                  <Field
                    id="reg-username"
                    name="userName"
                    type="text"
                    placeholder="Choose a username"
                    className={`form-input has-icon-left ${
                      touched.userName && errors.userName ? "input-error" : ""
                    }`}
                    autoComplete="username"
                  />
                </div>
                <ErrorMessage
                  name="userName"
                  component="div"
                  className="form-error-msg"
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="reg-password">
                  Password
                </label>
                <div className="input-with-icon">
                  <Lock size={18} className="input-icon-left" />
                  <Field
                    id="reg-password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a strong password"
                    className={`form-input has-icon-left has-icon-right ${
                      touched.password && errors.password ? "input-error" : ""
                    }`}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    className="input-icon-right-btn"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <ErrorMessage
                  name="password"
                  component="div"
                  className="form-error-msg"
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-block mt-3"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span>Creating Account...</span>
                ) : (
                  <>
                    <UserPlus size={18} />
                    <span>Sign Up</span>
                  </>
                )}
              </button>
            </Form>
          )}
        </Formik>

        {/* Footer */}
        <div className="auth-footer">
          <p>
            Already have an account?{" "}
            <Link to="/login" className="auth-switch-link">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
