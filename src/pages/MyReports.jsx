import API_URL, { imageSrc } from "../config";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import DashboardLayout from "../components/DashboardLayout";
import { SeverityBadge, StatusBadge } from "../components/Badges";
import { useAuth } from "../context/useAuth";
import { formatDate } from "../utils/ui";
import "../styling/MyReports.css";

// Backend route that returns the reports made by one user.
// If your route is named differently, change this one line.
const myReportsUrl = (userId) => `${API_URL}/reports/user/${userId}`;

const STAGES = ["Pending", "In Progress", "Resolved"];

function MyReports() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [statusFilter, setStatusFilter] = useState("");

    useEffect(() => {
        const getMyReports = async () => {
            try {
                const response = await fetch(myReportsUrl(user.id || user._id), {
                    headers: { Authorization: `Bearer ${user.token}` }
                });
                const data = await response.json();
                if (!response.ok) {
                    setError(data.message || "Unable to fetch your reports.");
                    return
                }
                // accept either a plain array or { reports: [...] }
                setReports(Array.isArray(data) ? data : data.reports || []);
            } catch (error) {
                console.error("Error fetching your reports:", error);
                setError("Unable to connect to the server.");
            } finally {
                setLoading(false)
            }
        }
        if (user?.token) {
            getMyReports();
        }
    }, [user]);

    // newest first
    const sorted = [...reports].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    const shown = sorted.filter((report) => statusFilter === "" || report.status === statusFilter);
    const refOf = (report) => (report._id || "").toString().slice(-4).toUpperCase();
    const tabs = [
        { value: "", label: "All", count: reports.length },
        { value: "Pending", label: "Pending", count: reports.filter((report) => report.status === "Pending").length },
        { value: "In Progress", label: "In Progress", count: reports.filter((report) => report.status === "In Progress").length },
        { value: "Resolved", label: "Resolved", count: reports.filter((report) => report.status === "Resolved").length }
    ];

    return (
        <DashboardLayout>
            <div className="dx-page mp-page">
                <div className="dx-head">
                    <div>
                        <p className="dx-eyebrow">Your reports</p>
                        <h1>My reports</h1>
                        <p className="dx-lede">Every pothole you have reported, and where each one stands with the municipality.</p>
                    </div>
                    <button className="dx-btn yellow" onClick={() => navigate("/report")}><PhotoCameraIcon fontSize="small" /> Report Pothole</button>
                </div>

                {loading && (
                    <div className="dx-panel" aria-busy="true">
                        <p className="dx-sr">Loading your reports...</p>
                        {[0, 1, 2].map((row) => <div key={row} className="dx-skel-row mp-skel"></div>)}
                    </div>
                )}

                {error && <p className="dx-notice" role="alert">{error}</p>}

                {!loading && !error && reports.length === 0 && (
                    <div className="dx-panel">
                        <div className="dx-empty">
                            <strong>You have not reported anything yet</strong>
                            When you report a pothole it will show up here, with its status.
                            <div><button className="dx-btn" onClick={() => navigate("/report")}>Report a pothole</button></div>
                        </div>
                    </div>
                )}

                {!loading && !error && reports.length > 0 && (
                    <>
                        <div className="dx-tabs">
                            {tabs.map((tab) => (
                                <button key={tab.label} className="dx-tab" aria-pressed={statusFilter === tab.value} onClick={() => setStatusFilter(tab.value)}>
                                    {tab.label}<span>{tab.count}</span>
                                </button>
                            ))}
                        </div>

                        {shown.length === 0 ? (
                            <div className="dx-panel">
                                <div className="dx-empty">
                                    <strong>Nothing here</strong>
                                    None of your reports are {statusFilter.toLowerCase()} right now.
                                </div>
                            </div>
                        ) : (
                            <ul className="mp-list">
                                {shown.map((report) => {
                                    const stage = STAGES.indexOf(report.status);
                                    return (
                                        <li key={report._id} className="mp-ticket">
                                            <div className="mp-photo">
                                                {report.image ? <img src={imageSrc(report.image)} alt="Reported pothole" loading="lazy" /> : <ImageOutlinedIcon />}
                                            </div>
                                            <div className="mp-main">
                                                <div className="mp-top">
                                                    <h2>{report.location}</h2>
                                                    <StatusBadge value={report.status} />
                                                </div>
                                                <p className="mp-meta">
                                                    <span>Ref {refOf(report)}</span>
                                                    <span>{formatDate(report.createdAt)}</span>
                                                    <SeverityBadge value={report.severity} />
                                                </p>
                                                <p className="mp-desc">{report.description}</p>
                                                <ol className="mp-track" aria-label={`Progress: ${report.status}`}>
                                                    {STAGES.map((name, index) => (
                                                        <li key={name} className={index < stage ? "done" : index === stage ? "current" : ""}>{name}</li>
                                                    ))}
                                                </ol>
                                            </div>
                                        </li>
                                    )
                                })}
                            </ul>
                        )}
                    </>
                )}
            </div>
        </DashboardLayout>
    )
}

export default MyReports