import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from "@/layout/Navbar";
import { Footer } from "@/layout/Footer";
import { Hero } from "@/sections/Hero";
import { About } from "@/sections/About";
import { Features } from "@/sections/Features";
import { Contact } from "@/sections/Contact";
import { CreateAccount } from "@/sections/CreateAccount";
import { Login } from "@/sections/Login";

function App() {
  return (
    <Router>
      <div className="min-h-screen overflow-x-hidden">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={
              <>
                <Hero />
                <About />
                <Features />
                <Contact />
              </>
            } />
            <Route path="/create-account" element={<CreateAccount />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  ); 
}

export default App;