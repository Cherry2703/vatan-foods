import { useState, useEffect, useRef } from "react";
import { FaBell, FaUserCircle } from "react-icons/fa";
import { HiMenuAlt3, HiX } from "react-icons/hi";
import { Link, useNavigate, useLocation } from "react-router-dom";

import "./Navbar.css";

const Navbar = () => {
  const [openMobile, setOpenMobile] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(false);
  const [openProfileDesktop, setOpenProfileDesktop] = useState(false);
  const [openProfileMobile, setOpenProfileMobile] = useState(false);
  const [selectedNav, setSelectedNav] = useState("/dashboard");
  const [user, setUser] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  const dropdownRef = useRef(null);
  const profileRefDesktop = useRef(null);
  const profileRefMobile = useRef(null);

  const notifications = 5;

  const navItems = [
    { label: "Dashboard", link: "/dashboard" },
    { label: "Track Order", link: "/track-order" },
    { label: "Orders", link: "/orders" },
    { label: "Raw Materials", link: "/raw-materials" },
    { label: "Cleaning", link: "/cleaning" },
    { label: "Packing", link: "/packing" },
    { label: "Settings", link: "/settings" },
  ];

  // Load user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
    if(storedUser){
        navigate("/dashboard");
    }
  }, []);

  useEffect(() => {
    setSelectedNav(location.pathname || "/dashboard");
  }, [location.pathname]);

  // Click outside handlers
  useEffect(() => {
    const handlePointerDownOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpenDropdown(false);
      }
      if (profileRefDesktop.current && !profileRefDesktop.current.contains(e.target)) {
        setOpenProfileDesktop(false);
      }
      if (profileRefMobile.current && !profileRefMobile.current.contains(e.target)) {
        setOpenProfileMobile(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDownOutside);
    return () => document.removeEventListener("pointerdown", handlePointerDownOutside);
  }, []);

  // Hide navbar on login/signup
  if (location.pathname === "/login" || location.pathname === "/signup") return null;

  const selectedLabel =
    navItems.find((item) => item.link === selectedNav)?.label || "Dashboard";

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setOpenProfileDesktop(false);
    setOpenProfileMobile(false);
    setOpenMobile(false);
    setOpenDropdown(false);
    window.location.reload()
    navigate("/login", { replace: true });
    // window.location.reload();
  };

  return (
    <nav className="neo-navbar">
      <div className="navbar-container">
        <div className="navbar-logo">Vatan Foods</div>

        {/* Desktop Links */}
        <ul className="navbar-links">
          <li className="dropdown" ref={dropdownRef}>
            <button
              className="dropdown-btn"
              onClick={() => setOpenDropdown((s) => !s)}
              type="button"
            >
              {selectedLabel} ▾
            </button>

            {openDropdown && (
              <ul className="dropdown-menu">
                {navItems.map((item) => (
                  <li key={item.link}>
                    <Link
                      to={item.link}
                      className={selectedNav === item.link ? "active-nav" : ""}
                      onClick={() => {
                        setSelectedNav(item.link);
                        setOpenDropdown(false);
                      }}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </li>

          <li className="notification-wrapper">
            <FaBell className="icon" />
            {notifications > 0 && (
              <span className="notification-count">{notifications}</span>
            )}
          </li>

          {/* Profile (desktop) */}
          <li className="profile-wrapper" ref={profileRefDesktop}>
            <FaUserCircle
              className="icon profile-icon"
              onClick={(e) => {
                e.stopPropagation();
                setOpenProfileDesktop((s) => !s);
              }}
            />
            {openProfileDesktop && (
              <div className="profile-popup">
                <h4>{user?.name || "Guest"}</h4>
                <p>Email: {user?.email || "-"}</p>
                <p>Mobile: {user?.mobile || "N/A"}</p>
                <button
                  type="button"
                  className="logout-btn"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            )}
          </li>
        </ul>

        {/* Mobile Menu Icon */}
        <button
          className="mobile-menu-icon"
          onClick={() => setOpenMobile((s) => !s)}
          type="button"
        >
          {openMobile ? <HiX /> : <HiMenuAlt3 />}
        </button>
      </div>

      {/* Mobile Menu */}
      {openMobile && (
        <div className="mobile-menu">
          <div className="mobile-navlinks">
            {navItems.map((item) => (
              <Link
                key={item.link}
                to={item.link}
                className={selectedNav === item.link ? "active-nav" : ""}
                onClick={() => {
                  setSelectedNav(item.link);
                  setOpenMobile(false);
                }}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <hr className="mobile-divider" />

          <div className="mobile-bottom">
            <div className="mobile-notification">
              <FaBell className="icon" />
              {notifications > 0 && (
                <span className="notification-count">{notifications}</span>
              )}
            </div>

            {/* Profile (mobile) */}
            <div className="mobile-profile" ref={profileRefMobile}>
              <FaUserCircle
                className="icon profile-icon"
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenProfileMobile((s) => !s);
                }}
              />
              {openProfileMobile && (
                <div className="profile-popup-mobile">
                  <h4>{user?.name || "Guest"}</h4>
                  <p>Email: {user?.email || "-"}</p>
                  <p>Mobile: {user?.mobile || "N/A"}</p>
                  <button
                    type="button"
                    className="logout-btn"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
