import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";

import { AuthProvider } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";
import Navbar from "./components/Navbar";
import { ProtectedRoute, PublicRoute } from "./components/RouteGuards";

import Landing from "./views/landing";
import Home from "./views/home";
import Create from "./views/create";
import Posts from "./views/posts";
import Profile from "./views/profile";
import Login from "./views/login";
import Register from "./views/register";
import SearchPage from "./views/search";
import PageNotFound from "./views/pageNotFound";

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Router>
          <div className="App">
            <Navbar />
            <main className="main-content">
              <Routes>
                {/* Root route: Shows Feed for members, Landing for guests */}
                <Route
                  path="/"
                  element={
                    <ProtectedRoute fallback={<Landing />}>
                      <Home />
                    </ProtectedRoute>
                  }
                />

                {/* Direct Landing */}
                <Route path="/landing" element={<Landing />} />

                {/* Explore Feed: Accessible to all (guests see login prompt when interacting) */}
                <Route path="/explore" element={<Home />} />

                {/* Search Page: Only accessible for logged-in members */}
                <Route
                  path="/search"
                  element={
                    <ProtectedRoute>
                      <SearchPage />
                    </ProtectedRoute>
                  }
                />

                {/* Protected Create Post Route */}
                <Route
                  path="/create"
                  element={
                    <ProtectedRoute>
                      <Create />
                    </ProtectedRoute>
                  }
                />

                {/* Post Detail & Discussion */}
                <Route path="/posts/:id" element={<Posts />} />

                {/* User Profile */}
                <Route path="/profile/:id" element={<Profile />} />

                {/* Auth Routes: Only accessible when logged out */}
                <Route
                  path="/login"
                  element={
                    <PublicRoute>
                      <Login />
                    </PublicRoute>
                  }
                />
                <Route
                  path="/register"
                  element={
                    <PublicRoute>
                      <Register />
                    </PublicRoute>
                  }
                />

                {/* 404 Catch All */}
                <Route path="*" element={<PageNotFound />} />
              </Routes>
            </main>
          </div>
        </Router>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
