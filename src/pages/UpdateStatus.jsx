import { imageSrc } from "../config";
import API_URL from "../config";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import DashboardLayout from "../components/DashboardLayout";
import ButtonLoader from "../components/ButtonLoader";
import { SeverityBadge, StatusBadge } from "../components/Badges";
import { useAuth } from "../context/useAuth";
import "../styling/UpdateStatus.css";

const STEPS = [
    { value: "Pending", hint: "Waiting to be looked at" },
    { value: "In Progress", hint: "Repair is under way" },
    { value: "Resolved", hint: "Fixed and closed" }
];

function UpdateStatus() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const report = location.state?.report;
    const [status, setStatus] = useState(report?.status || "Pending")
    const [updating, setUpdating] = useState(false);
    const handleUpdateStatus = async () => {
    if (!status) {
        alert("Please select a status.")
        return
    }

    setUpdating(true);
    try {
        const response = await fetch(`${API_URL}/reports/${report._id}/status`,
            {
                method: "PUT",
                headers: {"Content-Type": "application/json",Authorization:`Bearer ${user.token}`},
                body: JSON.stringify({status: status})
            }
        )
        const data = await response.json();
        if (!response.ok) {
            alert(data.message);
            return
        }
        alert("Report status updated successfully!")
        navigate("/municipality");
    } catch (error) {
        console.error("Update status error:",error)
        alert(
            "Unable to update report status."
        )
    } finally {
        setUpdating(false);
    }
}
// if someone hasnt selected a report first
    if (!report) {
        return (
            <DashboardLayout>
                <div className="dx-page update-status-page">
                    <div className="dx-head">
                        <div>
                            <p className="dx-eyebrow">Municipality</p>
                            <h1>Update Status</h1>
                        </div>
                    </div>
                    <div className="dx-panel">
                        <div className="dx-empty">
                            <strong>No report selected</strong>
                            Open a report from the list first, then choose Update Status.
                            <div><button className="dx-btn" onClick={() => navigate("/municipality")}>Back to Reports</button></div>
                        </div>
                    </div>
                </div>
            </DashboardLayout>
        )
    }
    return (
        <DashboardLayout>
            <div className="dx-page update-status-page">
                <div className="dx-head">
                    <div>
                        <button className="dx-back" onClick={() =>navigate("/municipality")}><ArrowBackIcon fontSize="small" /> All reports</button>
                        <p className="dx-eyebrow">Municipality</p>
                        <h1>Update Status</h1>
                    </div>
                </div>
                <div className="update-status-card">
                    <div className="update-image-container">
                        {report.image ? (
                            <img src={imageSrc(report.image)} alt="Reported pothole" className="update-report-image"/>
                        ) : (
                            <div className="no-report-image"><ImageOutlinedIcon /> No image uploaded</div>
                        )}
                    </div>
                    <div className="update-report-information">
                        <div className="us-summary">
                            <h2>{report.location}</h2>
                            <div className="us-badges">
                                <SeverityBadge value={report.severity} />
                                <StatusBadge value={report.status} />
                            </div>
                            <p className="us-description">{report.description}</p>
                        </div>
                    </div>

                    <div className="us-track">
                        <p className="dx-label">Update Status</p>
                        <div className="us-steps" role="radiogroup" aria-label="Update status">
                            {STEPS.map((step) => (
                                <label key={step.value} className="us-step">
                                    <input type="radio" name="status" value={step.value} checked={status === step.value} onChange={(event) => setStatus(event.target.value)} />
                                    <span className="us-node" aria-hidden="true"></span>
                                    <span className="us-step-text">
                                        <b>{step.value}</b>
                                        <small>{step.hint}{report.status === step.value ? " (current)" : ""}</small>
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="update-status-actions">
                        <button className="dx-btn plain" onClick={() =>navigate("/municipality")}>Cancel</button>
                        <button className={`dx-btn update-button${updating ? " is-loading" : ""}`} onClick={handleUpdateStatus} disabled={updating}>
                            <ButtonLoader loading={updating} loadingText="Updating...">Update Status</ButtonLoader>
                        </button>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    )
}
export default UpdateStatus