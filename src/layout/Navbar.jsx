import { useState } from "react";
import { Login } from "@/components/LoginButton";
import { CreateAccount } from "@/components/CreateAccountButton";
import { Menu } from "lucide-react";

const navLinks = [
  { href: "#about", label: "About" },
  { href: "#features", label: "Features" },
  { href: "#contact", label: "Contact" },
];

export const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  return (
    <header className="fixed right-0 left-0 top-0 bg-transparent py-5 glass-strong z-50">
      <nav className="container mx-auto px-6 flex items-center justify-between">
        <a href="#" className="tracking-tight font-bold text-xl hover:text-primary">
          STUDY FLOW<span className="text-primary">.</span>
        </a>

        {/* Deskttop Navigation Bar */}
        <div className="hidden md:flex items-center gap-1"> 
          <div className="glass rounded-full px-2 py-1 items-center gap-1"> {/* Loop through list */}
             {navLinks.map((link) => (
               <a href={link.href} key={link.href} className="text-muted-foreground hover:text-foreground text-sm px-4 py-2 rounded-full hover:bg-primary"
              >
               {link.label}
              </a>
             ))}     
          </div>
        </div>
             {/* Call to Action Button */}
             <div className="hidden md:flex items-center gap-3">
               <CreateAccount size="sm">Create Account</CreateAccount>
               <Login size="sm">Login</Login>
             </div>

          {/* Mobile Hamburger Menu */}
          <button
            className="md:hidden px-3 text-foreground cursor-pointer"
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            aria-expanded={isMobileMenuOpen}
            aria-label="Toggle menu"
          >
             <Menu size={27} />
          </button>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden glass-strong">
          <div className="container mx-auto px-6 py-6 flex flex-col gap-3">
              {navLinks.map((link) => (
                <a href={link.href} key={link.href} className="text-lg text-muted-foreground hover:text-foreground px-4 py-2 rounded-full hover:bg-primary"
                >
                  {link.label}
                </a>
              ))} 

              </div><div className="flex flex-col gap-3 mt-3"> {/* Add wrapper for spacing */}
            <CreateAccount size="md">Create Account</CreateAccount>

            <Login size="md">Login</Login>
          </div>
        </div>
      )}
    </header>
  );
};