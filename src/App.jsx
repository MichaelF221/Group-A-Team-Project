import { Routes, Route } from "react-router-dom";
import { Hero } from "@/sections/Hero";
import { About } from "@/sections/About";
import { Features } from "@/sections/Features";
import { Contact } from "@/sections/Contact";
import { Navbar } from "@/layout/Navbar";
import { Footer } from "@/layout/Footer";
import Kanban from "@/sections/Kanban";
import { Login } from "@/sections/Login";




function App() {
  return (
    <div className="min-h-screen overflow-x-hidden">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={
            <>
              <Hero />
              <About />
              <Features />
              <Login />
              <Contact />
            </>
          } />
          <Route path="/kanban" element={<Kanban />} />
        </Routes>
      </main>
      <Footer />
    </div>
 ); 
}

export default App;
