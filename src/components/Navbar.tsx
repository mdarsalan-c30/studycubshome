import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Menu, X, Phone } from "lucide-react";

const navLinks = [
  { label: "Home", href: "/#home", hash: "#home" },
  { label: "Programs", href: "/#programs", hash: "#programs" },
  { label: "About Us", href: "/#about", hash: "#about" },
  { label: "Blogs", href: "/blogs" },
  { label: "FAQ", href: "/#faq", hash: "#faq" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string, hash?: string) => {
    if (hash) {
      e.preventDefault();
      if (location.pathname !== "/") {
        navigate("/");
        setTimeout(() => {
          const el = document.querySelector(hash);
          if (el) el.scrollIntoView({ behavior: "smooth" });
        }, 100);
      } else {
        const el = document.querySelector(hash);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }
    }
    setOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-primary/10 via-background/95 to-secondary/10 backdrop-blur-md border-b border-border shadow-card">
      <div className="container mx-auto flex items-center justify-between py-3 px-4">
        {/* Refined Text Logo */}
        <Link 
          to="/" 
          onClick={(e: any) => handleNavClick(e, "/", "#home")} 
          className="flex items-center gap-0 group select-none"
        >
          <span className="font-display text-3xl font-extrabold tracking-tight text-primary drop-shadow-sm">Study</span>
          <span className="font-display text-3xl font-extrabold tracking-tight text-yellow-400 drop-shadow-sm group-hover:text-yellow-500 transition-colors">cubs</span>
          <span className="w-1.5 h-1.5 rounded-full bg-primary mt-3 ml-0.5"></span>
        </Link>

        <ul className="hidden md:flex items-center gap-7">
          {navLinks.map((l) => (
            <li key={l.label}>
              {l.hash ? (
                <a 
                  href={l.href} 
                  onClick={(e) => handleNavClick(e, l.href, l.hash)}
                  className="font-body font-semibold text-sm text-foreground/70 hover:text-primary transition-colors cursor-pointer"
                >
                  {l.label}
                </a>
              ) : (
                <Link to={l.href} className="font-body font-semibold text-sm text-foreground/70 hover:text-primary transition-colors">
                  {l.label}
                </Link>
              )}
            </li>
          ))}
        </ul>

        <a href="tel:+919876543210" className="hidden md:inline-flex items-center gap-2 font-display font-bold text-primary text-sm hover:underline">
          <Phone size={16} />
          9876 54 32 10
        </a>

        <button className="md:hidden text-foreground" onClick={() => setOpen(!open)} aria-label="Toggle menu">
          {open ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-card border-b border-border px-4 pb-4">
          <ul className="flex flex-col gap-3">
            {navLinks.map((l) => (
              <li key={l.label}>
                {l.hash ? (
                  <a 
                    href={l.href} 
                    onClick={(e) => handleNavClick(e, l.href, l.hash)}
                    className="font-body font-semibold text-foreground/80 hover:text-primary transition-colors block py-1 cursor-pointer"
                  >
                    {l.label}
                  </a>
                ) : (
                  <Link to={l.href} onClick={() => setOpen(false)} className="font-body font-semibold text-foreground/80 hover:text-primary transition-colors block py-1">
                    {l.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
          <a href="tel:+919876543210" className="mt-3 inline-flex items-center gap-2 font-display font-bold text-primary text-sm">
            <Phone size={16} /> 9876 54 32 10
          </a>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
