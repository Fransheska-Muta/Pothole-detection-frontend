import { Link } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import "../styling/Navbar.css";

function Navbar() {

    const { user } = useAuth();

    const isMunicipality = user?.role === "municipality";

    return (
     <>
        <nav className="side-navbar">

            {/* LOGO */}
            <div className="navbar-logo">

                <div className="logo-icon">
                    🚗
                </div>

                <h1>SPDMS</h1>

            </div>


            {/* NAVIGATION */}
            <div className="navbar-links">

                {/* HOME */}
                <Link to="/" className="navbar-link">
                    <span className="nav-icon">⌂</span>
                    <span>Home</span>
                </Link>


                {/* PROFILE */}
                <Link to="/profile" className="navbar-link">
                    <span className="nav-icon">♙</span>
                    <span>Profile</span>
                </Link>


                {/* LOCATIONS */}
                <Link to="/locations" className="navbar-link">
                    <span className="nav-icon">●</span>
                    <span>Locations</span>
                </Link>


                {/* NORMAL USER REPORT */}
                {!isMunicipality && (
                    <Link to="/report" className="navbar-link">
                        <span className="nav-icon">📸</span>
                        <span>Report</span>
                    </Link>
                )}


                {/* MUNICIPALITY ONLY */}
                {isMunicipality && (
                    <Link to="/reports" className="navbar-link">
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