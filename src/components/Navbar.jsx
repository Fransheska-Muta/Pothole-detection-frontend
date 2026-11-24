import { Drawer } from "@mui/material";
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { initialsOf, roleLabel } from "../utils/ui";
import "../styling/Navbar.css";

// The same menu is used twice: a fixed rail on wide screens, a drawer on small ones.
function NavContent({ closeNavbar, onProfile }) {
    const { user } = useAuth();
    const isMunicipality = user?.role === "municipality";
    const isSuperAdmin = user?.role === "superAdmin";
    const links = [
        { to: "/user", label: "Home" },
        { to: "/report", label: "Report" },
        ...(isMunicipality || isSuperAdmin ? [{ to: "/municipality", label: "View Reports" }] : []),
        ...(isSuperAdmin ? [{ to: "/superadmin", label: "Admin" }] : [])
    ];
    return (
        <div className="rail-inner">
            <div className="rail-brand">
                <img className="rail-plate" src="/LOGO.webp" alt="SPDMS Logo" />
                <div>
                    <b>SPDMS</b>
                    <small>Spot a pothole. Report it. Get it fixed.</small>
                </div>
            </div>

            <nav className="rail-links" aria-label="Main navigation">
                <p className="rail-label">Menu</p>
                {links.map((link, index) => (
                    <NavLink key={link.to} to={link.to} onClick={closeNavbar} className={({ isActive }) => `rail-link${isActive ? " active" : ""}`}>
                        <span className="rail-num">{String(index + 1).padStart(2, "0")}</span>
                        <span className="rail-text">{link.label}</span>
                    </NavLink>
                ))}
            </nav>

            <button className="rail-user" onClick={() => { closeNavbar(); onProfile(); }}>
                <span className="dx-mono-box" aria-hidden="true">{initialsOf(user?.name)}</span>
                <span className="rail-user-meta">
                    <strong>{user?.name || "Account"}</strong>
                    <small>{roleLabel(user?.role)}</small>
                </span>
            </button>
        </div>
    );
}

function Navbar({ isOpen, setIsOpen, onProfile }) {
    const closeNavbar = () => {
        setIsOpen(false)
    }
    return (
        <>
            <aside className="rail">
                <NavContent closeNavbar={closeNavbar} onProfile={onProfile} />
            </aside>
            <Drawer anchor="left" open={isOpen} onClose={closeNavbar} className="rail-drawer">
                <NavContent closeNavbar={closeNavbar} onProfile={onProfile} />
            </Drawer>
        </>
    )
}
export default Navbar