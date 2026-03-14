import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import EmergencyBanner from "./EmergencyBanner";

export default function Header({ currentUser }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  /* Scroll Effect */
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* Close mobile on route change */
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  const authLinks = currentUser
    ? [{ name: "Dashboard", path: "/donor" }]
    : [
        { name: "Login", path: "/login" },
        { name: "Register as Donor", path: "/register/donor" },
        { name: "Register as Facility", path: "/register/facility" },
      ];

  const isActive = (path) => location.pathname === path;

  return (
  <>
    {location.pathname === "/register/facility" && (
      <EmergencyBanner />
    )}

  <header
  className={`fixed ${
    location.pathname === "/register/facility"
      ? "top-8"
      : "top-0"
  } left-0 w-full z-50 transition-all duration-300 ${
    scrolled
      ? "bg-white shadow-lg"
      : "bg-white/80 backdrop-blur-md"
  }`}
>
        <div className="w-full px-4">
          <div className="flex items-center justify-between h-20">

            {/* Logo + Title */}
            <Link to="/" className="flex items-center gap-3">
              <div className="w-11 h-11 flex items-center justify-center rounded-xl bg-gradient-to-br from-red-600 to-red-700 text-white font-bold shadow-md">
                🩸
              </div>

              <h1 className="text-lg md:text-2xl font-extrabold tracking-wide uppercase bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent">
                BLOOD BANK MANAGEMENT SYSTEM
              </h1>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-3">

              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive(link.path)
                      ? "bg-red-50 text-red-700"
                      : "text-gray-700 hover:text-red-600 hover:bg-gray-100"
                  }`}
                >
                  {link.name}
                </Link>
              ))}

              <div className="w-px h-6 bg-gray-300 mx-2"></div>

              {authLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    link.name.includes("Register")
                      ? "bg-gradient-to-r from-red-600 to-red-700 text-white shadow-md hover:shadow-lg hover:scale-105"
                      : isActive(link.path)
                      ? "bg-red-50 text-red-700"
                      : "text-gray-700 hover:text-red-600 hover:bg-gray-100"
                  }`}
                >
                  {link.name}
                </Link>
              ))}

            </nav>

            {/* Mobile Button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            >
            ☰
            </button>

          </div>

          {/* Mobile Menu */}
          <div
            className={`md:hidden overflow-hidden transition-all duration-300 ${
              mobileOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <div className="bg-white shadow-lg rounded-b-xl p-4 space-y-2">
              {[...navLinks, ...authLinks].map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`block px-4 py-2 rounded-lg text-sm font-medium ${
                    isActive(link.path)
                      ? "bg-red-50 text-red-700"
                      : "text-gray-700 hover:bg-gray-100 hover:text-red-600"
                  }`}
                  onClick={() => setMobileOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

        </div>
      </header>
    </>
  );
}