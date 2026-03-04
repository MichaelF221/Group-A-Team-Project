import { Navbar } from "@/layout/Navbar";
import { Footer } from "@/layout/Footer";
import { Hero } from "@/sections/Hero";
import { About } from "@/sections/About";
import { Features } from "@/sections/Features";
import { Contact } from "@/sections/Contact";
import { Login } from "@/sections/Login";
import { CreateAccount } from "@/sections/CreateAccount";
import Kanban from "@/sections/Kanban";
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <div className="min-h-screen overflow-x-hidden">
      <Navbar />
      <Routes>
        <Route path="/" element={
          <main>
            <Hero />
            <About />
            <Features />
            <Contact />
          </main>
        } />
        <Route path="/login" element={<Login />} />
        <Route path="/create-account" element={<CreateAccount />} />
        <Route path="/kanban" element={<Kanban />} />
      </Routes>
      <Footer />
    </div>
 ); 
}

export default App;