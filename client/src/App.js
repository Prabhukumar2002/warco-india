import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "./LanguageContext";
import { ThemeProvider } from "./ThemeContext";
import { AuthProvider } from "./AuthContext";
import { SiteContentProvider } from "./SiteContentContext";
import Navbar from "./components/Navbar";
import EmergencyBar from "./components/EmergencyBar";
import Footer from "./components/Footer";
import ChatWidget from "./components/ChatWidget";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import About from "./pages/About";
import Services from "./pages/Services";
import Awareness from "./pages/Awareness";
import Training from "./pages/Training";
import Research from "./pages/Research";
import Contact from "./pages/Contact";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";

function PublicLayout({ children }) {
  return (
    <>
      <EmergencyBar />
      <Navbar />
      <main>{children}</main>
      <Footer />
      <ChatWidget />
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <SiteContentProvider>
          <AuthProvider>
            <BrowserRouter>
              <Routes>
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/"
                  element={
                    <PublicLayout>
                      <Home />
                    </PublicLayout>
                  }
                />
                <Route
                  path="/about"
                  element={
                    <PublicLayout>
                      <About />
                    </PublicLayout>
                  }
                />
                <Route
                  path="/services"
                  element={
                    <PublicLayout>
                      <Services />
                    </PublicLayout>
                  }
                />
                <Route
                  path="/awareness"
                  element={
                    <PublicLayout>
                      <Awareness />
                    </PublicLayout>
                  }
                />
                <Route
                  path="/training"
                  element={
                    <PublicLayout>
                      <Training />
                    </PublicLayout>
                  }
                />
                <Route
                  path="/research"
                  element={
                    <PublicLayout>
                      <Research />
                    </PublicLayout>
                  }
                />
                <Route
                  path="/contact"
                  element={
                    <PublicLayout>
                      <Contact />
                    </PublicLayout>
                  }
                />
              </Routes>
            </BrowserRouter>
          </AuthProvider>
        </SiteContentProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
