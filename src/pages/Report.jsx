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
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [selectedCoordinates, setSelectedCoordinates] = useState({latitude: null,longitude: null})

    const handleImageChange = (event) => {
        const selectedImage = event.target.files[0];
        if (selectedImage) {
            setImage(selectedImage);
        }
    }
const handleSubmit = async (event) => {
    event.preventDefault();

    if (!location.trim()) {
        alert("Please enter the location.")
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
    if (!image) {
        alert("Please upload an image of the pothole.");
        return
    }
    if (!user?.token) {
        alert("You are not logged in.");
        return
    }

    try {
        //  finding the coordinatesz
        const geocodeResponse = await fetch(`http://13.220.52.27:3000/geocode?address=${encodeURIComponent(location)}`,
         {headers: {Authorization: `Bearer ${user.token}`}}
        )
        const locationData =await geocodeResponse.json();
        if (!geocodeResponse.ok) {
            alert(locationData.message ||"Unable to find this location.")
            return
        }
        // getting the coordinates
        const latitude =Number(locationData.latitude);
        const longitude =Number(locationData.longitude);
        console.log("Latitude:", latitude);
        console.log("Longitude:", longitude);

        const formData = new FormData();
        formData.append("location", location);
        formData.append("latitude",selectedCoordinates.latitude)
        formData.append("longitude", selectedCoordinates.longitude)
        formData.append("severity",severity)
        formData.append("description",description)
        formData.append("image",image)

        const response = await fetch("http://13.220.52.27:3000/report",{ 
            method: "POST",
            headers:{Authorization:`Bearer ${user.token}`},
            body: formData
            }
        )
        const data =await response.json();
        if (!response.ok) {
            alert( data.message || "Unable to submit report")
            return
        }
        alert("Pothole reported successfully!")

        setLocation("");
        setDescription("");
        setSeverity("");
        setImage(null);
        navigate("/user");
    } catch (error) {
        console.error("Report error:",error)
        alert("Unable to submit report.")
    }
}
    
    const handleLocationChange = async (event) => {
    const value = event.target.value;
    setLocation(value);

    if (value.trim().length < 3) {
        setSuggestions([]);
        setShowSuggestions(false);
        return
    }

    try {
    const response = await fetch(`http://13.220.52.27:3000/geocode/suggestions?address=${encodeURIComponent(value)}`,{
        headers: {Authorization: `Bearer ${user?.token}`}}
    )
        const data = await response.json();

        if (!response.ok) {
            console.error(data.message);
            return
        }
        setSuggestions(data);
        setShowSuggestions(true);
       console.log("Suggestions received:", data);
    } catch (error) {
      console.error("Error getting location suggestions:",error)
    }
}

const selectLocation = (place) => {
    setLocation(place.name);
    setSelectedCoordinates({
        latitude: place.latitude,
        longitude: place.longitude
    })

    console.log("Selected place:", place);
    console.log("Coordinates:", {
    latitude: place.latitude,
    longitude: place.longitude
})
    setSuggestions([]);
    setShowSuggestions(false);
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
                        <input type="text" value={location} onChange={ handleLocationChange  }placeholder="Enter Location"/>
                        {showSuggestions && suggestions.length > 0 && (
                        <div className="location-suggestions">
                            {suggestions.map((place, index) => (
                                <div key={index} className="location-suggestion" onClick={() => selectLocation(place)}>{place.name}
                                </div>
                            ))}
                        </div>
                    )}
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