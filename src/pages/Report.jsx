import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import DashboardLayout from "../components/DashboardLayout";
import "../styling/Report.css";

function Report() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [location, setLocation] = useState("");
    const [description, setDescription] = useState("");
    const [severity, setSeverity] = useState("");
    const [image, setImage] = useState(null);

    const handleImageChange = (event) => {
        const selectedImage = event.target.files[0];
        if (selectedImage) {
            setImage(selectedImage);
        }
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!location.trim()) {
            alert("Please enter the location.");
            return
        }
        if (!severity) {
            alert("Please select the pothole severity.");
            return
        }
        if (!description.trim()) {
            alert("Please describe the pothole.");
            return
        }
        if(!image){
            alert("PLease upload an image of pothole")
            return
        }
        if(!user?.token){
            alert("You are not logged in")
            return
        }
        try {
            const formData = new FormData()
            formData.append("location", location)
            formData.append("severity", severity)
            formData.append("description", description)
            formData.append("image", image)
            const response = await fetch("http://localhost:3000/report",
                {
                  method: "POST",
                  headers: {Authorization: `Bearer ${user.token}`},
                //   because images cannot be stored using JSON we are using formData
                  body: formData
                }
            )
            const data = await response.json();
            if (!response.ok) {
                alert(data.message || "Unable to submit report");
                return
            }
            alert("Pothole reported successfully!");
            //clearing form
            setLocation("");
            setDescription("");
            setSeverity("");
            setImage(null);

            navigate("/user");
        } catch (error) {
            console.error("Report error:", error);
            alert("Unable to submit report.");
        }
    }
    return (
        <DashboardLayout>
            <div className="report-page">
              <h1>Report</h1>
              <form className="report-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Location:</label>
                    <div className="location-input">
                        <span className="location-icon"><img src="./location.png"/></span>
                        <input type="text" value={location} onChange={(event) =>setLocation(event.target.value)}placeholder="Turffontein"/>
                    </div>

                    </div>

                    <div className="form-group">
                        <label>Upload Image</label>
                        <div className="image-upload">
                        {image ? (
                        <img src={URL.createObjectURL(image)} alt="Pothole preview"/>
                        ) : (
                        <div className="image-placeholder">Upload pothole image</div>
                        )}
                        <label htmlFor="image-input" className="camera-button"><img src="./camera.webp"/></label>
                        <input id="image-input" type="file" accept="image/*" onChange={handleImageChange} hidden/>
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Description:</label>
                        <textarea value={description} onChange={(event) =>setDescription(event.target.value)}placeholder="Describe the pothole..."/>
                    </div>

                    <div className="severity-section">
                        <label>Pothole size (severity):</label>
                        <label className="severity-option">
                        <input type="radio" name="severity" value="Small" checked={severity === "Small"} onChange={(event) =>setSeverity(event.target.value)}/>
                        <span className="severity-circle small"></span>
                        <span>Small</span>
                        </label>

                        <label className="severity-option">
                            <input type="radio" name="severity" value="Medium" checked={severity === "Medium"} onChange={(event) =>setSeverity(event.target.value)}/>
                            <span className="severity-circle medium"></span>
                            <span>Medium</span>
                        </label>

                        <label className="severity-option">

                            <input type="radio" name="severity" value="Large" checked={severity === "Large"} onChange={(event) =>setSeverity(event.target.value)}/>
                            <span className="severity-circle large"></span>
                            <span> Large</span>
                        </label>
                    </div>

                    <button type="submit" className="submit-report">Submit</button>
                </form>
            </div>
        </DashboardLayout>
    )
}

export default Report