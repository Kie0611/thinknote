import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { AppProvider } from "./context/AppContext";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import NotesPage from "./pages/NotesPage";
import FlashcardsPage from "./pages/FlashcardsPage";
import AIChatPage from "./pages/AIChatPage";

import { useAuthStore } from "./store/useAuthStore";

import { Toaster } from "react-hot-toast";

export default function App() {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <AppProvider>
      <Routes>

        <Route path="/" element={authUser ? <DashboardPage /> : <Navigate to="/login" />} />
        <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
        <Route path="/register" element={!authUser ? <RegisterPage /> : <Navigate to="/" />} />

        <Route path="/dashboard" element={authUser ? <DashboardPage /> : <Navigate to="/login" />} />
        <Route path="/notes" element={authUser ? <NotesPage /> : <Navigate to="/login" />} />
        <Route path="/flashcards" element={authUser ? <FlashcardsPage /> : <Navigate to="/login" />} />
        <Route path="/ai-chat" element={authUser ? <AIChatPage /> : <Navigate to="/login" />} />

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
      <Toaster/>
    </AppProvider>
  );
}