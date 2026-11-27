import API_URL from "../config";
import { useState, useEffect, useRef } from "react";
import ButtonLoader from "../components/ButtonLoader";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import DashboardLayout from "../components/DashboardLayout";
import PlaceIcon from "@mui/icons-material/Place";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import "../styling/Report.css";

function Report() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [location, setLocation] = useState("");
    const [description, setDescription] = useState("");
    const [severity, setSeverity] = useState("");
    const [image, setImage] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const searchTimer = useRef(null);
    const searchId = useRef(0);
    const [selectedCoordinates, setSelectedCoordinates] = useState({latitude: null,longitude: null})

    useEffect(() => () => clearTimeout(searchTimer.current), []);
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

    setSubmitting(true);
    try {
        //  finding the coordinatesz
        const geocodeResponse = await fetch(`${API_URL}/geocode?address=${encodeURIComponent(location)}`,
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

        const response = await fetch(`${API_URL}/report`,{ 
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
    } finally {
        setSubmitting(false);
    }
}
    
// Suggestions come from OpenStreetMap, which only allows about one request per second. So we wait until the person stops typing before asking, and ignore
    const handleLocationChange = (event) => {
    const value = event.target.value;
    setLocation(value);
    clearTimeout(searchTimer.current);

    if (value.trim().length < 3) {
        searchId.current += 1;
        setSuggestions([]);
        setShowSuggestions(false);
        return
    }

    searchTimer.current = setTimeout(async () => {
        const thisSearch = ++searchId.current;
        try {
            const response = await fetch(`${API_URL}/geocode/suggestions?address=${encodeURIComponent(value)}`,{
                headers: {Authorization: `Bearer ${user?.token}`}
            });
            const data = await response.json();
            if (thisSearch !== searchId.current) {
                return          // a newer search started, or a place was chosen
            }
            if (!response.ok) {
                console.error(data.message);
                setSuggestions([]);
                return
            }
            setSuggestions(data);
            setShowSuggestions(true);
        } catch (error) {
            console.error("Error getting location suggestions:",error)
        }
    }, 700);
}

 
const selectLocation = (place) => {
    setLocation(place.name);
    clearTimeout(searchTimer.current);
    searchId.current += 1;
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
            <div className="dx-page report-page">
              <div className="dx-head">
                <div>
                  <p className="dx-eyebrow">New report</p>
                  <h1>Report a pothole</h1>
                  <p className="dx-lede">Tell us where it is, add a photo and how bad it looks. The municipality takes it from there.</p>
                </div>
              </div>

              <form className="report-form" onSubmit={handleSubmit}>
                <div className="form-group rp-location">
                    <label htmlFor="report-location"><span className="rp-num">01</span>Location</label>
                    <div className="location-input">
                        <span className="location-icon"><PlaceIcon fontSize="small" /></span>
                        <input id="report-location" type="text" value={location} onChange={ handleLocationChange  }placeholder="Enter Location" autoComplete="off"/>
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

                <div className="form-group rp-photo">
                    <span className="rp-label"><span className="rp-num">02</span>Upload Image</span>
                    <div className="image-upload">
                    {image ? (
                    <img src={URL.createObjectURL(image)} alt="Pothole preview"/>
                    ) : (
                    <label htmlFor="image-input" className="image-placeholder">
                        <PhotoCameraIcon fontSize="large" />
                        <strong>Upload pothole image</strong>
                        <span>Tap to take a photo or choose one</span>
                    </label>
                    )}
                    <label htmlFor="image-input" className="camera-button"><PhotoCameraIcon fontSize="small" /> {image ? "Change photo" : "Add photo"}</label>
                    <input id="image-input" type="file" accept="image/*" onChange={handleImageChange} hidden/>
                    </div>
                </div>

                <div className="form-group rp-description">
                    <label htmlFor="report-description"><span className="rp-num">03</span>Description</label>
                    <textarea id="report-description" value={description} onChange={(event) =>setDescription(event.target.value)}placeholder="Describe the pothole..."/>
                </div>

                <div className="severity-section">
                    <span className="rp-label"><span className="rp-num">04</span>Pothole size (severity)</span>
                    <div className="severity-options">
                    <label className="severity-option">
                    <input type="radio" name="severity" value="Small" checked={severity === "Small"} onChange={(event) =>setSeverity(event.target.value)}/>
                    <span className="severity-circle small"></span>
                    <span className="severity-text"><b>Small</b><small>Minor, easy to miss</small></span>
                    </label>

                    <label className="severity-option">
                        <input type="radio" name="severity" value="Medium" checked={severity === "Medium"} onChange={(event) =>setSeverity(event.target.value)}/>
                        <span className="severity-circle medium"></span>
                        <span className="severity-text"><b>Medium</b><small>Noticeable, slows cars down</small></span>
                    </label>

                    <label className="severity-option">
                        <input type="radio" name="severity" value="Large" checked={severity === "Large"} onChange={(event) =>setSeverity(event.target.value)}/>
                        <span className="severity-circle large"></span>
                        <span className="severity-text"><b>Large</b><small>Serious, a real danger</small></span>
                    </label>
                    </div>
                </div>

                <button type="submit" className={`dx-btn submit-report${submitting ? " is-loading" : ""}`} disabled={submitting}>
                    <ButtonLoader loading={submitting} loadingText="Submitting...">Submit</ButtonLoader>
                </button>
              </form>
            </div>
        </DashboardLayout>
    )
}

export default Report