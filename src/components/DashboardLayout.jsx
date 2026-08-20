import { useState } from "react";
import Navbar from "./Navbar";

function DashboardLayout({ children }) {

    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className={isOpen ? "dashboard-layout sidebar-open" : "dashboard-layout"}>

            <Navbar
                isOpen={isOpen}
                setIsOpen={setIsOpen}
            />

            <main className="dashboard-content">
                {children}
            </main>

        </div>
    );
}

export default DashboardLayout;