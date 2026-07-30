// import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"
import "../styling/SuperAdminDashboard.css";

function SuperAdminDashboard() {
    // const [users, setUsers] = useState([]);
    const navigate = useNavigate();

    const logout = () =>{
     localStorage.removeItem("user");
     navigate("/");
    }

return (
    <>
    <div className="dashboard">
            <header className="dashboard-header">
                <h1>SPDMS Super Admin Dashboard</h1>
                <button className="logout-btn" onClick={logout}>
                    Logout
                </button>
            </header>
            <section className="dashboard-body">
                <h2>Users</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Action</th>
                        </tr>
                    </thead>

        <tbody>

    {/* {users.map((user) => (
        <tr key={user._id}>
            <td>{user.name}</td>
            <td>{user.email}</td>
            <td>{user.role}</td>
            <td>
                Promote
            </td>
        </tr>
    ))} */}

</tbody>

                </table>

            </section>

        </div>
        </>
    );
}

export default SuperAdminDashboard