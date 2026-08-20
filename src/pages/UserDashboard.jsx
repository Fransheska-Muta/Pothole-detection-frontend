import { useState, useEffect } from "react";
import { useAuth } from "../context/useAuth";
import DashboardLayout from "../components/DashboardLayout";
import "../styling/UserDashboard.css";
import { useNavigate } from "react-router-dom";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup, useMap} from "react-leaflet";

const defaultLocation = [-26.2041, 28.0473];
function ChangeMapLocation({ coordinates }) {
    const map = useMap();
    useEffect(() => {
    if ( coordinates.latitude !== null && coordinates.longitude !== null) {
        map.setView([ coordinates.latitude, coordinates.longitude],15)
    }}, [coordinates, map]);
    return null
}

function UserDashboard() {
    const navigate = useNavigate()
    const { user } = useAuth()
    const [location, setLocation] = useState("Enter your location");
    const [coordinates, setCoordinates] = useState({latitude: null,longitude: null});
    const [showProfile, setShowProfile] = useState(false);

    // getting user location
    const getMyLocation = () => {
        if (!navigator.geolocation) {
            alert("Geolocation is not supported by your browser.");
            return
        }
        navigator.geolocation.getCurrentPosition(
            (position) => {
            const latitude = position.coords.latitude
            const longitude = position.coords.longitude
            // console.log("Latitude:", latitude)
            // console.log("Longitude:", longitude)
            setCoordinates({ latitude, longitude})
            setLocation("My location")
            }
        )
}
    const handleReport = () => {
    navigate("/report");
}
    const searchLocation = async () => {
        if (!location || location === "Enter your location") {
            alert("Please enter a location");
            return
        }
        try {
            const response = await fetch(`http://localhost:3000/geocode?address=${encodeURIComponent(location)}`,{headers: {Authorization: `Bearer ${user.token}`}});
            const data = await response.json();
            if (!response.ok) {
                alert(data.message);
                return
            }
            console.log("Location found:", data);
            setCoordinates({latitude: Number(data.latitude),longitude: Number(data.longitude)})
        } catch (error) {
            console.error("Search error:", error);
            alert("Unable to search for location");
        }
}

    return (
        <DashboardLayout>
            <div className="user-dashboard">
                <div className="dashboard-top">
                <div className="location-search">
                <button className="location-button" onClick={getMyLocation}><img src="./location.png"/></button>
                <input type="text" value={location} onChange={(event) =>setLocation(event.target.value)}/>
                <button className="location-button" onClick={searchLocation}><img src="./search.webp"/></button>
                </div>
                
                <button className="profile-button" onClick={() => setShowProfile(true)}>
                    <span><img src="./profile.webp"/></span>
                </button>

                </div>

                {showProfile && (
                    <div className="profile-modal-overlay">
                        <div className="profile-modal">
                        <button className="profile-close" onClick={() => setShowProfile(false)}>x</button>
                            <h2>My Profile</h2>
                            <div className="profile-information">
                                <div className="profile-avatar">
                                    <img src="./profile.webp"/>
                                </div>

                                <div className="profile-field">
                                    <label>Name</label>
                                    <p>{user?.name || "Not available"}</p>
                                </div>

                                <div className="profile-field">
                                    <label>Email</label>
                                    <p>{user?.email || "Not available"}</p>
                                </div>

                                <div className="profile-field">
                                    <label>Role</label>
                                    <p>{user?.role || "Not available"}</p>
                                </div>
                            </div>

                            <button className="profile-done" onClick={() => setShowProfile(false)}>Close</button>
                        </div>
                    </div>
                )}

                <div className="map-container">
                    <MapContainer center={defaultLocation} zoom={12} className="user-map">
                    <TileLayer attribution="&copy; OpenStreetMap contributors" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
                        <ChangeMapLocation coordinates={coordinates}/>
                        {coordinates.latitude !== null && coordinates.longitude !== null && (
                        <Marker position={[ coordinates.latitude, coordinates.longitude]}>
                        <Popup>Selected Location</Popup>
                        </Marker>
                    )}
                    </MapContainer>
                </div>

                {coordinates.latitude !== null && (
                <p className="coordinates">Latitude: {coordinates.latitude} Longitude: {coordinates.longitude}</p>
                )}

                <div className="detection-section">
                    <div className="location-button">
                        <img src="./warning.jpg"/>
                    </div>

                    <div className="detection-message">
                        POTHOLE DETECTED ON MAIN ROAD
                    </div>
                </div>

                <div className="report-section">
                    <div className="location-button">
                        <img src="camera.webp"/>
                    </div>

                    <button className="report-pothole-button" onClick={handleReport}>Report Pothole</button>
                </div>
            </div>
        </DashboardLayout>
    )
}


export default UserDashboard