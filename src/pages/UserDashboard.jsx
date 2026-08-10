import { useNavigate } from "react-router-dom"
import '../styling/UserDashboard.css';

function UserDashboard() {
    const navigate = useNavigate();
    const logout = () =>{
     localStorage.removeItem("user");
     navigate("/");
    }

    return (
        <>
            <h1 className="dashboard">User Dashboard</h1>
            <button className="logout-btn" onClick={logout}>
              Logout
            </button>
        </>
    );
}

export default UserDashboard