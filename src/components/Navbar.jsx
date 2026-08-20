import { Link } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import "../styling/Navbar.css";

function Navbar({ isOpen, setIsOpen }) {
const { user } = useAuth()
const isMunicipality = user?.role === "municipality"
const isSuperAdmin = user?.role === "superAdmin"
let homePath = "/";
if (user?.role === "user") {
    homePath = "/user";
} else if (user?.role === "municipality") {
    homePath = "/municipality";
} else if (user?.role === "superAdmin") {
    homePath = "/superAdmin";
}
    return (
     <>
        <button className="hamburger-button" onClick={() => setIsOpen(!isOpen)}>☰</button>

            <nav className={isOpen ? "side-navbar open" : "side-navbar"}>
                <button className="close-button" onClick={() => setIsOpen(false)}>x</button>
                <div className="navbar-logo">
                    <div className="logo-icon"><img src="/LOGO.webp"/></div>
                    <h1>SPDMS</h1>
                </div>
                
                <div className="navbar-links">
                    <Link to={homePath} className="navbar-link" onClick={() => setIsOpen(false)}>
                        <span className="nav-icon">⌂</span>
                        <span>Home</span>
                    </Link>

                    <Link to="/report" className="navbar-link" onClick={() => setIsOpen(false)}>
                        <span className="nav-icon">●</span>
                        <span>Report</span>
                    </Link>

                    {isMunicipality && (
                        <Link to="/report" className="navbar-link" onClick={() => setIsOpen(false)}>
                            <span className="nav-icon">📸</span>
                            <span>Report</span>
                        </Link>
                    )}

                    {isMunicipality && (
                        <Link to="/reports" className="navbar-link" onClick={() => setIsOpen(false)}>
                            <span className="nav-icon">📋</span>
                            <span>View Reports</span>
                        </Link>
                    )}
                    {isSuperAdmin && (
                        <Link to="/reports" className="navbar-link" onClick={() => setIsOpen(false)}>
                            <span className="nav-icon">📋</span>
                            <span>View Reports</span>
                        </Link>
                    )}

                </div>

            </nav>
        </>
    );
}

export default Navbar;