import { Link } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import "../styling/Navbar.css";

function Navbar({ isOpen, setIsOpen }) {
    const { user } = useAuth();

    const isMunicipality = user?.role === "municipality";
    const isSuperAdmin = user?.role === "superAdmin";

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
                    <Link to="/user" className="navbar-link" onClick={() => setIsOpen(false)}>
                        <span>Home</span>
                    </Link>
                    <Link to="/report" className="navbar-link" onClick={() => setIsOpen(false)}>
                        <span>Report</span>
                    </Link>

                    {(isMunicipality || isSuperAdmin) && (
                        <Link to="/municipality" className="navbar-link" onClick={() => setIsOpen(false)}>
                            <span>View Reports</span>
                        </Link>
                    )}
                    {isSuperAdmin && (
                        <Link to="/superAdmin" className="navbar-link" onClick={() => setIsOpen(false)}>
                            <span>Admin</span>
                        </Link>
                    )}
                </div>
            </nav>
        </>
    )
}

export default Navbar