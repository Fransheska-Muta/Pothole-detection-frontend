import { useState } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import Navbar from "./Navbar";
import ProfileModal from "./ProfileModal";
import { useAuth } from "../context/useAuth";
import { initialsOf } from "../utils/ui";
import "../styling/DashboardShared.css";

function DashboardLayout({ children }) {
    const [isOpen, setIsOpen] = useState(false);
    const [showProfile, setShowProfile] = useState(false);
    const { user } = useAuth();
    return (
        <div className="dx-shell">
            <Navbar isOpen={isOpen} setIsOpen={setIsOpen} onProfile={() => setShowProfile(true)} />
            <div className="dx-main">
                {/* phones and small tablets: the rail folds into a slim bar + drawer */}
                <header className="dx-mobilebar">
                    <button className="dx-icon-btn" onClick={() => setIsOpen(true)} aria-label="Open menu">
                        <MenuIcon />
                    </button>
                    <div className="dx-mobile-brand">
                        <img src="/LOGO.webp" alt="" />
                        <b>SPDMS</b>
                    </div>
                    <span className="dx-spacer"></span>
                    <button className="dx-mono-box" onClick={() => setShowProfile(true)} aria-label="Open profile">{initialsOf(user?.name)}</button>
                </header>
                <main>{children}</main>
            </div>
            {showProfile && <ProfileModal onClose={() => setShowProfile(false)} />}
        </div>
    )
}

export default DashboardLayout