import { Navbar } from "@/layout/Navbar";
import { Hero } from "@/sections/Hero"; // @ means source folder, no need for dots .../section etc
import { About } from "@/sections/About";
import { Features } from "@/sections/Features";
import { Login } from "@/sections/Login";
import { Contact } from "@/sections/Contact";

function App() {
  return (
    <div className="min-h-screen overflow-x-hidden">
      <Navbar />
      <main>
        <Hero />
        <About />
        <Features />
        <Login />
        <Contact />
      </main>
    </div>
 ); 
}

export default App;
