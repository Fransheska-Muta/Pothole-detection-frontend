import { useState } from "react";
import Login from "../components/Login";
import Signup from "../components/Signup";

function AuthPage() {
 const [showSignup, setShowSignup] = useState(true);
 return (
    <>
       {showSignup ? (
         <Signup
            showLogin={() => setShowSignup(false)}/>): 
            (<Login
             showSignup={() => setShowSignup(true)}
            />
    )}

    </>
);
}

export default AuthPage;