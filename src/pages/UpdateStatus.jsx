import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import { useAuth } from "../context/useAuth";
import "../styling/UpdateStatus.css";

function UpdateStatus() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const report = location.state?.report;
    const [status, setStatus] = useState(report?.status || "Pending")
    const handleUpdateStatus = async () => {
    if (!status) {
        alert("Please select a status.")
        return
    }

    try {
        const response = await fetch(`http://13.220.52.27:3000/reports/${report._id}/status`,
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
    }
}
// if someone hasnt selected a report first
    if (!report) {
        return (
            <DashboardLayout>
                <div className="update-status-page">
                    <h1>Update Status</h1>
                    <p>No report was selected.</p>
                    <button onClick={() => navigate("/municipality")}>Back to Reports</button>
                </div>
            </DashboardLayout>
        )
    }
    return (
        <DashboardLayout>
            <div className="update-status-page">
                <div className="update-status-header">
                    <h1>Update Status</h1>
                </div>
                <div className="update-status-card">
                    <div className="update-image-container">
                        {report.image ? (
                            <img src={`http://13.220.52.27:3000/uploads/${report.image}`} alt="Reported pothole" className="update-report-image"/>
                        ) : (
                            <div className="no-report-image">No image uploaded</div>
                        )}
                    </div>
                    <div className="update-report-information">
                        <div className="update-field">
                            <label>Location</label>
                            <p>{report.location}</p>
                        </div>
                        <div className="update-field">
                            <label>Severity
                            </label>
                            <p>{report.severity}</p>
                        </div>
                        <div className="update-field">
                            <label>Description</label>
                            <p>{report.description}</p>
                        </div>
                        <div className="update-field">
                            <label>Current Status</label>
                            <p>{report.status}</p>
                        </div>
                        <div className="update-field">
                            <label>Update Status</label>
                            <select value={status} onChange={(event) =>setStatus(event.target.value)}>
                                <option value="Pending">Pending</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Resolved">Resolved</option>
                            </select>
                        </div>
                    </div>
                    <div className="update-status-actions">
                        <button className="back-button" onClick={() =>navigate("/municipality")}>Cancel</button>
                    <button className="update-button" onClick={handleUpdateStatus}>Update Status</button>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    )
}
export default UpdateStatus