import { Navbar } from "@/layout/Navbar";
import { Footer } from "@/layout/Footer";
import { Hero } from "@/sections/Hero";
import { About } from "@/sections/About";
import { Features } from "@/sections/Features";
import { Login } from "@/sections/Login";
import Chatbot from "./Chatbot"; 
import { CreateAccount } from "@/sections/CreateAccount";
import Kanban from "@/sections/Kanban";
import Account from "@/sections/Account";
import { Routes, Route, Navigate } from "react-router-dom";
// import { useState } from "react";

function ProtectedRoute({ children }) {
  const isLoggedIn = Boolean(localStorage.getItem("studyflow_token"));
  return isLoggedIn ? children : <Navigate to="/login" replace />;
}

function App() {
  return (
    <div className="min-h-screen overflow-x-hidden">
      <Navbar />
      <Routes>
        <Route path="/" element={
          <main>
            <Hero />
          </main>
        } />
        <Route path="/login" element={<Login />} />
        <Route path="/create-account" element={<CreateAccount />} />
        <Route
          path="/kanban"
          element={
            <ProtectedRoute>
              <Kanban />
            </ProtectedRoute>
          }
        />
        <Route
          path="/chatbot"
          element={
            <ProtectedRoute>
              <Chatbot />
            </ProtectedRoute>
          }
        />
        <Route
          path="/account"
          element={
            <ProtectedRoute>
              <Account />
            </ProtectedRoute>
          }
        />
        <Route path="/about" element={<About />}/>
      </Routes>
      <Footer />
    </div>
 ); 
}

export default App;
