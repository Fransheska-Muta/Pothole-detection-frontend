import API_URL from "../config";
import { useState } from "react";
import "../styling/Auth.css";
import ButtonLoader from "./ButtonLoader";
import RoadScene from "./RoadScene";
import DriveTransition from "./DriveTransition";
import {useNavigate} from "react-router-dom"
import {useAuth} from "../context/useAuth"

function Signup({ showLogin }) {
  const navigate = useNavigate()
const {login} = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [driving, setDriving] = useState(false);

  const handleSignup = async (event) => {
    event.preventDefault();
    setLoading(true);
     try {
        const response = await fetch(`${API_URL}/signup`, {
          method: "POST",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify({name,email,password,confirmPassword})
    })
      const data = await response.json();
        if (response.ok) {
            login(data);
            alert("Welcome to SPDMS! Together, we're making roads safer");
            setDriving(true) // the drive animation navigates to /user when it ends
            //resets the form to nothing in it
        setName(""); setEmail(""); 
        setPassword(""); setConfirmPassword(""); 
        // showLogin();
    }else {
      alert(data.message);
    }}catch(error){
       console.error(error);
       alert("Unable to connect to the server.");
    } finally {
       setLoading(false);
    }
}
     return (
        <>
        <div className="signup-container">
            <div className="signup-left">
                <div className="auth-brand"><img src="/LOGO.webp" alt="SPDMS logo" /><b>SPDMS</b></div>
                <h1>SIGN UP</h1>

                <form onSubmit={handleSignup}>
                    <label htmlFor="name">Name</label>
                    <input type="text" value={name} name="name" onChange={(event)=>setName(event.target.value)}/>
                    
                    <label htmlFor="email">Email</label>
                    <input type="email" value={email} name="email" onChange={(event)=>setEmail(event.target.value)}/>
                    
                    <label htmlFor="password">Password</label>
                    <input type="password" value={password} name="password" onChange={(event)=>setPassword(event.target.value)}/>
                    
                    <label htmlFor="confirm">Confirm Password</label>
                    <input type="password" value={confirmPassword} name="confirm" onChange={(event)=>setConfirmPassword(event.target.value)}/>
                    
                    <button type="submit" disabled={loading} className={loading ? "is-loading" : ""}>
                        <ButtonLoader loading={loading} loadingText="Creating account...">Sign Up</ButtonLoader>
                    </button>
                    <p> Already have an account? <span onClick={showLogin}> Login </span> </p>
                </form>
            </div>
            <div className="signup-right">
                <RoadScene />
                <h2> Hey, <br/> Welcome</h2>
                <p className="auth-blurb">Spot a pothole. Report it. Get it fixed.</p>
            </div>
        </div>
        {driving && (
            <DriveTransition message="Welcome aboard! Let's make the roads safer..." onComplete={() => navigate("/user")} />
        )}
</>
    );
}

export default Signup