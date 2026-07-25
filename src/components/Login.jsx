import { useState } from "react";
import "../styling/Login.css";

function Login({ showSignup }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    
    const handleLogin = async (event) => {
        event.preventDefault();
        try {
            const credentials = btoa(`${email}:${password}`);
            const response = await fetch("http://localhost:3000/login", {
                method: "POST",
                headers: {
                    Authorization: `Basic ${credentials}`
                }
            });
            const data = await response.json();
            if (response.ok) {
                alert("Login Successful!");
                console.log(data);
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.log(error);
            alert("Unable to connect to server.");
        }
    }
    return (
        <>
       <div className="login-container">
    <div className="login-left">
        <h1>LOGIN</h1>
        <form onSubmit={handleLogin}>
            <label>Email</label>
            <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} />

            <label>Password</label>
            <input type="password" value={password} onChange={(event) => setPassword(event.target.value)}/>
            <button type="submit">Login</button>
            <p> Don't have an account? <span onClick={showSignup}> Sign Up</span> </p>
        </form>
    </div>

    <div className="login-right">
        <div className="circle top"></div>
        <h2> Welcome<br/>Back </h2>
        <div className="circle bottom"></div>
    </div>
 </div>
    </>
);
}

export default Login;