import { useEffect } from "react";
import CloseIcon from "@mui/icons-material/Close";
import LogoutIcon from "@mui/icons-material/Logout";
import { useAuth } from "../context/useAuth";
import { initialsOf, roleLabel } from "../utils/ui";

// Opened from the account block in the rail. Reads like a record card.
function ProfileModal({ onClose }) {
    const { user, logout } = useAuth();

    useEffect(() => {
        const onKey = (event) => {
            if (event.key === "Escape") {
                onClose();
            }
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [onClose]);

    return (
        <div className="dx-overlay" onClick={onClose}>
            <div className="dx-modal dx-id" role="dialog" aria-modal="true" aria-labelledby="profile-title" onClick={(event) => event.stopPropagation()}>
                <div className="dx-modal-bar">
                    <span className="dx-modal-kicker">Account</span>
                    <button className="dx-icon-btn" onClick={onClose} aria-label="Close profile"><CloseIcon fontSize="small" /></button>
                </div>

                <div className="dx-id-main">
                    <div className="dx-mono-box dx-mono-lg" aria-hidden="true">{initialsOf(user?.name)}</div>
                    <h2 id="profile-title">My Profile</h2>
                </div>

                <dl className="dx-id-fields">
                    <div>
                        <dt>Name</dt>
                        <dd>{user?.name || "Not available"}</dd>
                    </div>
                    <div>
                        <dt>Email</dt>
                        <dd>{user?.email || "Not available"}</dd>
                    </div>
                    <div>
                        <dt>Role</dt>
                        <dd>{roleLabel(user?.role)}</dd>
                    </div>
                </dl>

                <div className="dx-modal-actions">
                    <button className="dx-btn plain" onClick={onClose}>Close</button>
                    <button className="dx-btn" onClick={logout}><LogoutIcon fontSize="small" /> Logout</button>
                </div>
            </div>
        </div>
    );
}

export default ProfileModal