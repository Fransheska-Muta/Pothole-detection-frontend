import API_URL from "../config";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import "../styling/Auth.css";
import ButtonLoader from "./ButtonLoader";
import RoadScene from "./RoadScene";
import DriveTransition from "./DriveTransition";

function Login({ showSignup }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [driving, setDriving] = useState(false);
  const navigate = useNavigate();  
   const {login} = useAuth();
  const handleLogin = async (event) => {
    event.preventDefault();
    setLoading(true);
     try {
        const credentials = btoa(`${email}:${password}`);
        const response = await fetch(`${API_URL}/login`, {
            method: "POST",
            headers: {
            Authorization: `Basic ${credentials}`
    }});
        const data = await response.json();
          if (response.ok) {
           login(data); 
        alert("You're back! Let's keep an eye on the road")
            setDriving(true) // the drive animation navigates to /user when it ends
            // console.log(data);              
        } else {
            alert(data.message);
        }
    } catch (error) {
        console.log(error);
        alert("Unable to connect to server.");
    } finally {
        setLoading(false);
    }
}
    return (
        <>
       <div className="login-container">
    <div className="login-left">
        <div className="auth-brand"><img src="/LOGO.webp" alt="SPDMS logo" /><b>SPDMS</b></div>
        <h1>LOGIN</h1>
        <form onSubmit={handleLogin}>
            <label htmlFor="email">Email</label>
            <input type="email" value={email} name="email" onChange={(event) => setEmail(event.target.value)} />
            <label htmlFor="password">Password</label>
            <input type="password" value={password} name="password" onChange={(event) => setPassword(event.target.value)}/>
            <button type="submit" disabled={loading} className={loading ? "is-loading" : ""}>
                <ButtonLoader loading={loading} loadingText="Logging in...">Login</ButtonLoader>
            </button>
            <p> Don't have an account? <span onClick={showSignup}> Sign Up</span> </p>
        </form>
    </div>

    <div className="login-right">
        <RoadScene />
        <h2> Welcome <br/>Back </h2>
        <p className="auth-blurb">Spot a pothole. Report it. Get it fixed.</p>
    </div>
 </div>
    {driving && (
        <DriveTransition message="Welcome back! Eyes on the road..." onComplete={() => navigate("/user")} />
    )}
    </>
);
}

export default Login