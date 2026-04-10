import { useEffect, useState } from "react";
import { Login } from "@/components/LoginButton";
import { CreateAccount } from "@/components/CreateAccountButton";
import { Circle, LogOut, Menu, Settings, User } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const navLinks = [
  { href: "/about", label: "About" },
  { href: "#features", label: "Features" },
  { href: "/chat.html", label: "Chatroom" },
];

const protectedNavLinks = [
  { href: "/kanban", label: "Kanban" },
  { href: "/chatbot", label: "Chatbot" },
  { href: "/quiz", label: "Quiz" },
];
export const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(() => Boolean(localStorage.getItem("studyflow_token")));
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setIsUserMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const syncAuthState = () => {
      setIsLoggedIn(Boolean(localStorage.getItem("studyflow_token")));
    };

    window.addEventListener("storage", syncAuthState);
    window.addEventListener("auth-changed", syncAuthState);

    return () => {
      window.removeEventListener("storage", syncAuthState);
      window.removeEventListener("auth-changed", syncAuthState);
    };
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem("studyflow_token");
    localStorage.removeItem("studyflow_user");
    setIsLoggedIn(false);
    window.dispatchEvent(new Event("auth-changed"));
    setIsUserMenuOpen(false);
    setIsMobileMenuOpen(false);
    navigate("/");
  };

  const visibleLinks = isLoggedIn ? [...navLinks, ...protectedNavLinks] : navLinks;

  return (
    <header className="fixed right-0 left-0 top-0 bg-transparent py-5 glass-strong z-50">
      <nav className="container mx-auto px-6 flex items-center justify-between">
        <Link to="/" className="tracking-tight font-bold text-xl hover:text-primary">
          STUDY FLOW<span className="text-primary">.</span>
        </Link>

        {/* Deskttop Navigation Bar */}
        <div className="hidden md:flex items-center gap-1"> 
          <div className="glass rounded-full px-2 py-1 items-center gap-1"> {/* Loop through list */}
             {visibleLinks.map((link) => (
               <a href={link.href} key={link.href} className="text-muted-foreground hover:text-foreground text-sm px-4 py-2 rounded-full hover:bg-primary"
              >
               {link.label}
              </a>
             ))}     
          </div>
        </div>
             {/* Call to Action Button */}
             <div className="hidden md:flex items-center gap-3">
               {!isLoggedIn ? (
                 <>
                   <CreateAccount size="sm">Create Account</CreateAccount>
                   <Login size="sm">Login</Login>
                 </>
               ) : (
                 <>
                   <div className="flex items-center gap-2 text-sm text-foreground px-3 py-2 rounded-full glass">
                     <Circle size={10} className="text-green-500 fill-green-500" />
                     <span>You're logged in</span>
                   </div>
                   <div className="relative">
                     <button
                       className="p-2 rounded-full glass hover:bg-primary/20 transition cursor-pointer"
                       onClick={() => setIsUserMenuOpen((prev) => !prev)}
                       aria-expanded={isUserMenuOpen}
                       aria-label="Open user menu"
                     >
                       <User size={18} />
                     </button>
                     {isUserMenuOpen && (
                       <div className="absolute right-0 mt-2 w-36 rounded-lg glass-strong border border-border p-2">
                         <Link
                           to="/account"
                           onClick={() => setIsUserMenuOpen(false)}
                           className="mb-1 flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm transition hover:bg-primary/20"
                         >
                           <Settings size={16} />
                           <span>Account</span>
                         </Link>
                         <button
                           onClick={handleSignOut}
                           className="w-full flex items-center gap-2 text-sm px-3 py-2 rounded-md hover:bg-primary/20 transition text-left"
                         >
                           <LogOut size={16} />
                           <span>Sign out</span>
                         </button>
                       </div>
                     )}
                   </div>
                 </>
               )}
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
          {visibleLinks.map((link) => (
            <a
              href={link.href}
              key={link.href}
              className="text-lg text-muted-foreground hover:text-foreground px-4 py-2 rounded-full hover:bg-primary"
            >
              {link.label}
            </a>
          ))}

          <div className="flex flex-col gap-3 mt-3"> {/* Add wrapper for spacing */}
            {!isLoggedIn ? (
              <>
                <CreateAccount size="md">Create Account</CreateAccount>
                <Login size="md">Login</Login>
              </>
            ) : (
              <>
                <div className="flex items-center gap-2 text-sm text-foreground px-4 py-2 rounded-full glass w-fit">
                  <Circle size={10} className="text-green-500 fill-green-500" />
                  <span>You're logged in</span>
                </div>
                <Link
                  to="/account"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 px-4 py-2 rounded-full border border-border hover:bg-primary/20 transition"
                >
                  <Settings size={16} />
                  <span>Account</span>
                </Link>
                <button
                  onClick={handleSignOut}
                  className="flex items-center justify-center gap-2 px-4 py-2 rounded-full border border-border hover:bg-primary/20 transition"
                >
                  <LogOut size={16} />
                  <span>Sign out</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
      )}
    </header>
  );
};
