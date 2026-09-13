import { useState } from "react";
import Navbar from "./Navbar";

function DashboardLayout({ children }) {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div>
            <Navbar isOpen={isOpen} setIsOpen={setIsOpen}/>
            <main>{children}</main>
        </div>
    )
}

export default DashboardLayout