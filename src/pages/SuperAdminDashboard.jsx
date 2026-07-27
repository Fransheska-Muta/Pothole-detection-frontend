// import {useState} from "react"
import { useEffect } from "react";

function SuperAdminDashboard() {
//   const [users, setUsers] = useState([]); 

  useEffect(() => {
    fetch("http:")
    console.log("Dashboard Loaded");

}, []);
    return (
        <>
            <h1>Hellooo Super Admin</h1>
        </>
    );
}

export default SuperAdminDashboard