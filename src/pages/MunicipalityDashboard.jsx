import { useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import "../styling/MunicipalityDashboard.css";

function MunicipalityDashboard() {

    const [locationFilter, setLocationFilter] = useState("All");
    const [severityFilter, setSeverityFilter] = useState("All");
    const [statusFilter, setStatusFilter] = useState("All");

    // Temporary data
    // We will replace this with data from the backend later.
    const reports = [
        {
            id: 1,
            location: "Main Street",
            severity: "Large",
            status: "Pending"
        },
        {
            id: 2,
            location: "Turffontein",
            severity: "Medium",
            status: "In Progress"
        },
        {
            id: 3,
            location: "Alberton",
            severity: "Small",
            status: "Resolved"
        }
    ];

    // Filter the reports
    const filteredReports = reports.filter((report) => {

        const locationMatches =
            locationFilter === "All" ||
            report.location === locationFilter;

        const severityMatches =
            severityFilter === "All" ||
            report.severity === severityFilter;

        const statusMatches =
            statusFilter === "All" ||
            report.status === statusFilter;

        return (
            locationMatches &&
            severityMatches &&
            statusMatches
        );
    });

    return (

        <DashboardLayout>

            <div className="municipality-dashboard">

                {/* FILTER SECTION */}

                <div className="filter-section">

                    <h2>Filter:</h2>


                    <div className="filter">

                        <label>
                            Location
                        </label>

                        <select
                            value={locationFilter}
                            onChange={(event) =>
                                setLocationFilter(event.target.value)
                            }
                        >
                            <option value="All">All</option>
                            <option value="Main Street">
                                Main Street
                            </option>
                            <option value="Turffontein">
                                Turffontein
                            </option>
                            <option value="Alberton">
                                Alberton
                            </option>
                        </select>

                    </div>


                    <div className="filter">

                        <label>
                            Severity
                        </label>

                        <select
                            value={severityFilter}
                            onChange={(event) =>
                                setSeverityFilter(event.target.value)
                            }
                        >
                            <option value="All">All</option>
                            <option value="Large">Large</option>
                            <option value="Medium">Medium</option>
                            <option value="Small">Small</option>
                        </select>

                    </div>


                    <div className="filter">

                        <label>
                            Status
                        </label>

                        <select
                            value={statusFilter}
                            onChange={(event) =>
                                setStatusFilter(event.target.value)
                            }
                        >
                            <option value="All">All</option>
                            <option value="Pending">Pending</option>
                            <option value="In Progress">
                                In Progress
                            </option>
                            <option value="Resolved">
                                Resolved
                            </option>
                        </select>

                    </div>

                </div>


                {/* REPORTS TABLE */}

                <div className="reports-table-container">

                    <table className="reports-table">

                        <thead>

                            <tr>
                                <th>ID</th>
                                <th>Location</th>
                                <th>Severity</th>
                                <th>Status</th>
                            </tr>

                        </thead>


                        <tbody>

                            {filteredReports.map((report) => (

                                <tr key={report.id}>

                                    <td>
                                        #{report.id}
                                    </td>

                                    <td>
                                        {report.location}
                                    </td>

                                    <td className={`severity ${report.severity.toLowerCase()}`}>
                                        {report.severity}
                                    </td>

                                    <td className={`status ${report.status.toLowerCase().replace(" ", "-")}`}>
                                        {report.status}
                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </table>

                </div>

            </div>

        </DashboardLayout>
    );
}

export default MunicipalityDashboard;