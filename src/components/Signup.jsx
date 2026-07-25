import { useState } from "react";
import "../styling/Signup.css";

function Signup({ showLogin }) {

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleSignup = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch("http://localhost:3000/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name,
                    email,
                    password,
                    confirmPassword,
                }),
            });
            const data = await response.json();
            if (response.ok) {
                alert("Account created successfully!");

                //resets the form to nothing in it
                setName("");
                setEmail("");
                setPassword("");
                setConfirmPassword("");
                showLogin();
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error(error);
            alert("Unable to connect to the server.");
        }
    };
     return (
        <>
        <div className="signup-container">
            <div className="signup-left">
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
                    <button type="submit"> Sign Up </button>
                    <p> Already have an account? <span onClick={showLogin}> Login </span> </p>
                </form>
            </div>
            <div className="signup-right">
                <div className="circle top"></div>
                <div className="circle bottom"></div>
                <h2> Hey <br/> Welcome</h2>
            </div>
        </div>
</>
    );
}

export default Signup;