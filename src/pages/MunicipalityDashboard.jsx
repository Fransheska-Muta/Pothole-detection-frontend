import { imageSrc } from "../config";
import API_URL from "../config";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import CloseIcon from "@mui/icons-material/Close";
import DashboardLayout from "../components/DashboardLayout";
import { SeverityBadge, StatusBadge } from "../components/Badges";
import { useAuth } from "../context/useAuth";
import { formatDate } from "../utils/ui";
import "../styling/MunicipalityDashboard.css";

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
        const response = await fetch(`${API_URL}/municipality/reports`,{
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

    // ---- display only ----
    const filtersActive = severityFilter !== "" || locationFilter !== "" || statusFilter !== "";
    const clearFilters = () => {
        setSeverityFilter("")
        setLocationFilter("")
        setStatusFilter("")
    }
    const tabs = [
        { value: "", label: "All reports", count: reports.length },
        { value: "Pending", label: "Pending", count: reports.filter((report) => report.status === "Pending").length },
        { value: "In Progress", label: "In Progress", count: reports.filter((report) => report.status === "In Progress").length },
        { value: "Resolved", label: "Resolved", count: reports.filter((report) => report.status === "Resolved").length }
    ];
    const refOf = (report) => (report._id || "").toString().slice(-4).toUpperCase();

    return (
        <DashboardLayout>
            <div className="dx-page mr-page">
                <div className="dx-head">
                    <div>
                        <p className="dx-eyebrow">Municipality</p>
                        <h1>Pothole reports</h1>
                        <p className="dx-lede">Review what residents have flagged, open a report for the photo and details, then update its status as the repair moves along.</p>
                    </div>
                </div>

                {!loading && !error && (
                    <div className="dx-tabs">
                        {tabs.map((tab) => (
                            <button key={tab.label} className="dx-tab" aria-pressed={statusFilter === tab.value} onClick={() => setStatusFilter(tab.value)}>
                                {tab.label}<span>{tab.count}</span>
                            </button>
                        ))}
                    </div>
                )}

                <div className="mr-filters">
                    <div className="dx-field mr-grow">
                        <label className="dx-label" htmlFor="mr-location">Location</label>
                        <input id="mr-location" className="dx-input" type="text" placeholder="Search location..." value={locationFilter} onChange={(event) =>setLocationFilter(event.target.value)}/>
                    </div>
                    <div className="dx-field">
                        <label className="dx-label" htmlFor="mr-severity">Severity</label>
                        <select id="mr-severity" className="dx-select" value={severityFilter} onChange={(event) =>setSeverityFilter(event.target.value)}>
                            <option value="">All</option>
                            <option value="Small">Small</option>
                            <option value="Medium">Medium</option>
                            <option value="Large">Large</option>
                        </select>
                    </div>
                    <div className="dx-field">
                        <label className="dx-label" htmlFor="mr-status">Status</label>
                        <select id="mr-status" className="dx-select" value={statusFilter} onChange={(event) =>setStatusFilter(event.target.value)}>
                            <option value="">All</option>
                            <option value="Pending">Pending</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Resolved">Resolved</option>
                        </select>
                    </div>
                    <button className="dx-btn plain mr-clear" onClick={clearFilters} disabled={!filtersActive}>Clear Filters</button>
                </div>

                {loading && (
                    <div className="dx-panel" aria-busy="true">
                        <p className="dx-sr">Loading reports...</p>
                        {[0, 1, 2, 3, 4].map((row) => <div key={row} className="dx-skel-row"></div>)}
                    </div>
                )}

                {error && (
                    <p className="dx-notice" role="alert">{error}</p>
                )}

                {!loading &&
                    !error && (
                    <>
                    <p className="mr-count">Showing {filteredReports.length} of {reports.length}</p>
                    <div className="dx-panel mr-table-wrap">
                        <table className="mr-table">
                            <thead>
                                <tr>
                                <th className="c-photo"><span className="dx-sr">Photo</span></th>
                                <th>Location</th>
                                <th>Severity</th>
                                <th>Description</th>
                                <th>Status</th>
                                <th>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                            {filteredReports.map((report) => (
                            <tr key={report._id} onClick={() =>handleReportClick(report)} onKeyDown={(event) => { if (event.key === "Enter") handleReportClick(report) }} tabIndex={0} className="mr-row">
                            <td className="c-photo">
                                <span className="mr-thumb">
                                    {report.image ? <img src={imageSrc(report.image)} alt="" loading="lazy" /> : <ImageOutlinedIcon fontSize="small" />}
                                </span>
                            </td>
                            <td className="c-loc"><span>{report.location}</span><small>Ref {refOf(report)}</small></td>
                            <td className="c-sev"><SeverityBadge value={report.severity} /></td>
                            <td className="c-desc"><span>{report.description}</span></td>
                            <td className="c-status"><StatusBadge value={report.status} /></td>
                            <td className="c-date">{formatDate(report.createdAt)}</td>
                            </tr>
                            ))}
                            </tbody>
                        </table>
                        {filteredReports.length === 0 && (
                            <div className="dx-empty">
                                <strong>No reports match</strong>
                                Try a different location or clear the filters.
                                {filtersActive && <div><button className="dx-btn plain small" onClick={clearFilters}>Clear Filters</button></div>}
                            </div>
                        )}
                    </div>
                    </>
                )}

                {showDetails &&
                selectedReport && (
                <div className="dx-overlay" onClick={closeModal}>
                <div className="dx-modal mr-modal" role="dialog" aria-modal="true" aria-labelledby="mr-modal-title" onClick={(event) =>event.stopPropagation()}>
                <div className="dx-modal-bar">
                    <span className="dx-modal-kicker">Report details &middot; Ref {refOf(selectedReport)}</span>
                    <button className="dx-icon-btn" onClick={closeModal} aria-label="Close"><CloseIcon fontSize="small" /></button>
                </div>
                <h2 id="mr-modal-title">{selectedReport.location}</h2>
                <div className="mr-modal-image">
                {selectedReport.image ? (<img src={imageSrc(selectedReport.image)} alt="Reported pothole"/>
                ) : (<div className="no-image"><ImageOutlinedIcon /> No image uploaded</div>)}
                <span className="mr-modal-stamp"><StatusBadge value={selectedReport.status} big /></span>
                </div>
                <dl className="mr-facts">
                <div>
                <dt>Pothole Size</dt>
                <dd><SeverityBadge value={selectedReport.severity} /></dd>
                </div>
                <div>
                <dt>Status</dt>
                <dd>{selectedReport.status}</dd>
                </div>
                <div>
                <dt>Reported</dt>
                <dd>{formatDate(selectedReport.createdAt)}</dd>
                </div>
                <div>
                    <dt>Description</dt>
                    <dd>{selectedReport.description}</dd>
                </div>
                </dl>
            <div className="dx-modal-actions">
                <button className="dx-btn plain" onClick={closeModal}>Close</button>
                <button className="dx-btn" onClick={() => {navigate("/update-status",
                {state: {report:selectedReport}})}}>Update Status</button>
            </div>
            </div></div>)}
            </div>
        </DashboardLayout>
    )
}

export default MunicipalityDashboard