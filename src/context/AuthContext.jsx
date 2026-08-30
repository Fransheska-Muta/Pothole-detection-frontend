import { createContext, useState } from "react";
// import {useNavigate} from "react-router-dom"

const AuthContext = createContext();
export function AuthProvider({ children }) {
    // const navigate = useNavigate();
    const [user, setUser] = useState( JSON.parse(localStorage.getItem("user")));
    const login = (userData) => { localStorage.setItem("user", JSON.stringify(userData));
        setUser(userData)
    };
    const logout = () => { localStorage.removeItem("user");
        setUser(null)
        // navigate("/login")
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthContext