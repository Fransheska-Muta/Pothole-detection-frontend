import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import { useAuth } from "../context/useAuth";
import "../styling/MunicipalityDashboard.css";
// import UpdateStatus from "./pages/UpdateStatus"

function MunicipalityDashboard() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showDetails, setShowDetails] = useState(false);
    const [selectedReport, setSelectedReport] = useState(null);
    const [severityFilter, setSeverityFilter] = useState("");
    const [locationFilter, setLocationFilter] = useState("");
    const [statusFilter, setStatusFilter] = useState("");

    useEffect(() => {
    const getReports = async () => {
    try {
        const response = await fetch("http://localhost:3000/municipality/reports",{
        headers: {Authorization:`Bearer ${user.token}`}})
        const data = await response.json();
        if (!response.ok) {
        setError(data.message || "Unable to fetch reports.");
        return
        }
        setReports(data);
        } catch (error) {
        console.error("Error fetching reports:",error);
        setError("Unable to connect to the server.");
        } finally {setLoading(false)}
        }
        if (user?.token) {
            getReports();
        }
    }, [user]);

    const handleReportClick = (report) => {
        setSelectedReport(report)
        setShowDetails(true)
    }

    const closeModal = () => {
        setShowDetails(false);
        setSelectedReport(null);
    }

    const filteredReports = reports.filter((report) => {
    const matchesSeverity = severityFilter === "" || report.severity === severityFilter;
    const matchesLocation = locationFilter === "" || report.location?.toLowerCase().includes(locationFilter.toLowerCase());
    const matchesStatus = statusFilter === "" || report.status === statusFilter;
    return (matchesSeverity &&matchesLocation &&matchesStatus)
    })
    return (
        <DashboardLayout>
            <div className="municipality-reports">
                <div className="reports-header">
                    <div>
                        <h1>View Reports</h1>
                        <p> View and manage pothole reports submitted by users. Click on the status to update it</p>
                    </div>
                </div>
                <div className="report-filters">
                    <div className="filter-group">
                     <label> Location </label>
                    <input type="text" placeholder="Search location..." value={locationFilter} onChange={(event) =>setLocationFilter(event.target.value)}/>
                    </div>
                    <div className="filter-group">
                        <label>Severity</label>
                        <select value={severityFilter} onChange={(event) =>setSeverityFilter(event.target.value)}>
                        <option value="">All</option>
                        <option value="Small">Small</option>
                        <option value="Medium">Medium</option>
                        <option value="Large">Large</option>
                        </select>
                    </div>
                    <div className="filter-group">
                        <label>Status</label>
                        <select value={statusFilter} onChange={(event) =>setStatusFilter(event.target.value)}>
                        <option value="">All</option>
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Resolved">Resolved</option>
                        </select>
                    </div>
                    <button className="clear-filters" onClick={() => {
                    setSeverityFilter("")
                    setLocationFilter("")
                    setStatusFilter("")
                }}>Clear Filters</button>
                </div>

                {loading && (
                <p className="reports-message">Loading reports...</p>
                )}

                {error && (
                <p className="reports-error">{error}</p>
                )}

                {!loading &&
                    !error && (
                    <div className="reports-table-container">
                        <table className="reports-table">
                            <thead>
                                <tr>
                                <th>Location</th>
                                <th>Severity</th>
                                <th>Description</th>
                                <th>Status</th>
                                <th>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                            {filteredReports.map((report) => (
                            <tr key={report._id} onClick={() =>handleReportClick(report)}className="report-row">

                            <td>{report.location}</td>
                            <td><span className={`severity-badge ${report.severity?.toLowerCase()}`}>{report.severity}</span></td>
                            <td>{report.description}</td>
                            <td><span className={`status-badge ${report.status?.toLowerCase().replace(" ", "-")}`}>{report.status}</span>
                            </td>
                            <td>{report.createdAt? new Date(report.createdAt).toLocaleDateString(): "N/A"}
                            </td>
                            </tr>
                            ))}
                            </tbody>
                        </table>
                        {filteredReports.length === 0 && (<p className="no-reports"> Oh no! no reports match your filters.</p>
                        )}
                    </div>
                )}

                {showDetails &&
                selectedReport && (
                <div className="report-modal-overlay" onClick={closeModal}>
                <div className="report-details-modal" onClick={(event) =>event.stopPropagation()}>
                <button className="report-modal-close" onClick={closeModal}>x</button>
                <h2>Report Details</h2>
                <div className="report-image-section">
                {selectedReport.image ? (<img src={`http://localhost:3000/uploads/${selectedReport.image}`} alt="Reported pothole" className="report-detail-image"/>
                ) : (<div className="no-image">No image uploaded</div>)}
                </div>
                <div className="report-information">
                <div className="report-field">
                <label>Location</label>
                <p>{selectedReport.location}</p>
                </div>
                <div className="report-field">
                <label>Pothole Size</label>
                <p>{selectedReport.severity}</p>
                </div>
                <div className="report-field">
                    <label>Description</label>
                    <p>{selectedReport.description}</p>
                </div>
                <div className="report-field">
                <label>Status</label>
                <p>{selectedReport.status}</p>
            </div>
            </div>
            <button className="update-status-button" onClick={() => {navigate("/update-status",
                {state: {report:selectedReport}})}}>Update Status</button>
            </div></div>)}
            </div>
        </DashboardLayout>
    )
}

export default MunicipalityDashboard