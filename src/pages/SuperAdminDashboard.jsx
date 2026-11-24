import API_URL from "../config";
import { useEffect, useState } from "react";
import { useAuth } from "../context/useAuth";
import "../styling/SuperAdminDashboard.css";
import DashboardLayout from "../components/DashboardLayout"
import ButtonLoader from "../components/ButtonLoader";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import { initialsOf, roleLabel } from "../utils/ui";

const ROLE_CHOICES = [
    { value: "user", label: "User", hint: "Can report and view potholes" },
    { value: "municipality", label: "Municipality", hint: "Can also review and update reports" },
    { value: "superAdmin", label: "SuperAdmin", hint: "Full access, including roles" }
];

function SuperAdminDashboard() {
    const {user} = useAuth();
    const [users, setUsers] = useState([]);
    const [showModal, setShowModal] = useState(false)
    const [email, setEmail] = useState("");
    const [role, setRole] = useState("user");
    const [promoting, setPromoting] = useState(false);
    const [demotingEmail, setDemotingEmail] = useState(null);
    const [search, setSearch] = useState("");

useEffect(() => {
    async function getUsers() {
        try {
            const response = await fetch( `${API_URL}/users`, { headers: { Authorization: `Bearer ${user.token}`}});
            const data = await response.json();
            setUsers(data);
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    }
    if (user?.token) {
        getUsers();
    }
}, [user]);
const handlePromote = async () => {
    if (!email) {
        alert("Please enter an email");
        return
    }
    if (!role) {
        alert("Please select a role");
        return
    }
    setPromoting(true);
    try {
        const response = await fetch(`${API_URL}/users/promote`,
            {
                method: "PUT",
                headers: { Authorization: `Bearer ${user.token}`,"Content-Type": "application/json"},
                body: JSON.stringify({email: email,role: role})
            }
        );
        const data = await response.json();
        // console.log("Promotion response:", data);
        if (!response.ok) {
            alert(data.message);
            return
        }
        // Adding the promoted user to table
        setUsers((currentUsers) => [...currentUsers,data.user]);

        setShowModal(false);
        setEmail("");
        setRole("user");
    } catch (error) {
        console.error(
            "Promotion error:",error
        );

        alert("Unable to promote user.");
    } finally {
        setPromoting(false);
    }
}
const handleDemote = async (email) => {
    const confirmDemote = window.confirm(`Are you sure you want to demote ${email}?`);
    if (!confirmDemote) {
        return
    }
    setDemotingEmail(email);
    try {
        const response = await fetch(`${API_URL}/users/demote`,
            {
              method: "PUT",
              headers: {Authorization: `Bearer ${user.token}`,"Content-Type": "application/json"},
              body: JSON.stringify({email: email})
            }
        );
        const data = await response.json();
        if (!response.ok) {
            alert(data.message);
            return
        }
        // Remove the demoted user from the table
        setUsers((currentUsers) =>currentUsers.filter((currentUser) => currentUser.email !== email));
        alert("User demoted successfully!");
    } catch (error) {
        console.error("Demotion error:",error);
        alert("Unable to demote user.");
    } finally {
        setDemotingEmail(null);
    }
}

// ---- display only ----
const term = search.trim().toLowerCase();
const visibleUsers = users.filter((person) => term === "" || person.name?.toLowerCase().includes(term) || person.email?.toLowerCase().includes(term));
const countRole = (value) => users.filter((person) => person.role === value).length;

return (
    <DashboardLayout>
          <div className="dx-page sa-page">
            <div className="dx-head">
                <div>
                    <p className="dx-eyebrow">Super admin</p>
                    <h1>Super Admin Dashboard</h1>
                    <p className="dx-lede">Welcome, {user?.name}. Give people the right access, or take it away.</p>
                </div>
                <button className="dx-btn yellow" onClick={()=>setShowModal(true)}><AddIcon fontSize="small" /> Promote user</button>
            </div>

            <div className="dx-figures">
                <div><b>{users.length}</b><span>People listed</span></div>
                <div><b>{countRole("municipality")}</b><span>Municipality</span></div>
                <div><b>{countRole("superAdmin")}</b><span>Super admins</span></div>
            </div>

            <div className="sa-toolbar">
                <h2>Users</h2>
                <div className="sa-search">
                    <SearchIcon fontSize="small" />
                    <input type="text" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search name or email" aria-label="Search users" />
                </div>
            </div>

            <div className="dx-panel">
            <table className="sa-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Action</th>
                    </tr>
                </thead>

                <tbody>
                    {visibleUsers.map((person) => (
                        <tr key={person._id}>
                            <td className="c-name">
                                <div className="person">
                                    <span className="dx-mono-box" aria-hidden="true">{initialsOf(person.name)}</span>
                                    <span>{person.name}</span>
                                </div>
                            </td>
                            <td className="c-email">{person.email}</td>
                            <td className="c-role"><span className={`dx-tag sa-role ${person.role}`}>{roleLabel(person.role)}</span></td>
                            <td className="c-action"><button className={`dx-btn danger small${demotingEmail === person.email ? " is-loading" : ""}`} onClick={()=> handleDemote(person.email)} disabled={demotingEmail === person.email}><ButtonLoader loading={demotingEmail === person.email} loadingText="Removing...">Remove Role</ButtonLoader></button></td>
                        </tr>
                    ))}
                </tbody>

            </table>
            {visibleUsers.length === 0 && (
                <div className="dx-empty">
                    <strong>{users.length === 0 ? "No users yet" : "No one matches"}</strong>
                    {users.length === 0 ? "People you promote will show up here." : "Try a different name or email."}
                </div>
            )}
            </div>

    {showModal && (
        <div className="dx-overlay">
        <div className="dx-modal sa-modal" role="dialog" aria-modal="true" aria-labelledby="sa-modal-title">
            <div className="dx-modal-bar">
                <span className="dx-modal-kicker">Roles</span>
                <button className="dx-icon-btn" onClick={() => setShowModal(false)} aria-label="Close"><CloseIcon fontSize="small" /></button>
            </div>
            <h2 id="sa-modal-title"> Promote Users </h2>

            <p className="sa-modal-text"> Promote users by entering their email and selecting new roles</p>

            <div className="dx-field">
                <label className="dx-label" htmlFor="sa-email">Email</label>
                <input id="sa-email" className="dx-input" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Enter user email"/>
            </div>

            <fieldset className="sa-roles">
                <legend className="dx-label">Role</legend>
                {ROLE_CHOICES.map((choice) => (
                    <label key={choice.value} className="sa-role-option">
                        <input type="radio" name="role" value={choice.value} checked={role === choice.value} onChange={(event) => setRole(event.target.value)} />
                        <span className="sa-role-text"><b>{choice.label}</b><small>{choice.hint}</small></span>
                    </label>
                ))}
            </fieldset>

            <div className="dx-modal-actions">
                <button className="dx-btn plain" onClick={() => setShowModal(false)}> Cancel </button>
                <button className={`dx-btn${promoting ? " is-loading" : ""}`} onClick={handlePromote} disabled={promoting}><ButtonLoader loading={promoting} loadingText="Promoting...">Promote</ButtonLoader></button>
            </div>
        </div>
    </div>)}
    </div>
    </DashboardLayout>
);
}

export default SuperAdminDashboard