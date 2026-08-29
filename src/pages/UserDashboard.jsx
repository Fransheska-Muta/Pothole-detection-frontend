import { useState, useEffect } from "react";
import { useAuth } from "../context/useAuth";
import DashboardLayout from "../components/DashboardLayout";
import "../styling/UserDashboard.css";
import { useNavigate } from "react-router-dom";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup, useMap} from "react-leaflet";
import L from "leaflet"
// import "@fortawesome/fontawesome-free/css/all.min.css";

const defaultLocation = [-26.2041, 28.0473];
function ChangeMapLocation({ coordinates }) {
    const map = useMap();
    useEffect(() => {
    if ( coordinates.latitude !== null && coordinates.longitude !== null) {
        map.setView([ coordinates.latitude, coordinates.longitude],15)
    }}, [coordinates, map]);
    return null
}

// users location marker
const userLocationIcon = L.divIcon({
    className: "",
    html: `
        <div class="user-pin">
            <div class="pin-center"></div>
        </div>
    `,
    iconSize: [30, 42],
    iconAnchor: [15, 42],
    popupAnchor: [0, -42]
});

const potholeIcon = L.divIcon({
    className: "",
    html: `
        <div class="pothole-wrapper">
            <div class="pothole-pulse"></div>
            <div class="pothole-pin">
                <div class="pin-center"></div>
            </div>
        </div>
    `,
    iconSize: [40, 52],
    iconAnchor: [20, 52],
    popupAnchor: [0, -52]
});

function UserDashboard() {
    const navigate = useNavigate()
    const { user, logout } = useAuth()
    const [location, setLocation] = useState("");
    const [coordinates, setCoordinates] = useState({latitude: null,longitude: null});
    const [showProfile, setShowProfile] = useState(false);
    const [reports, setReports] = useState([])
    const [nearestPothole, setNearestPothole] = useState(null);
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);

    // calculates teh distance betwen current position and nearest pothole
    const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1 * Math.PI / 180) *Math.cos(lat2 * Math.PI / 180) *Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}
    // getting the reported potholes
    useEffect(() => {
    const getReports = async () => {
        try {
            const response = await fetch("http://localhost:3000/reports",{
                headers: {Authorization:`Bearer ${user.token}`}
                }
            )
            const data = await response.json();
            if (!response.ok) {
             console.error("Unable to get reports:",data.message)
             return
            }
            console.log("Pothole reports:", data);
            setReports(data);
        } catch (error) {
         console.error("Error fetching reports:",error)
        }
    }
    if (user?.token) {
        getReports()
    }
}, [user]);

useEffect(() => {
    let closest = null;
    let shortestDistance = Infinity;
    reports.forEach((report) => {
        if (report.latitude === null ||report.longitude === null ||report.latitude === undefined ||report.longitude === undefined) {
            return
        }

        const distance = calculateDistance(
            coordinates.latitude,
            coordinates.longitude,
            Number(report.latitude),
            Number(report.longitude)
        );

        if (distance < shortestDistance) {
            shortestDistance = distance;
            closest = { ...report,distance: distance.toFixed(2)}
        }
        setNearestPothole(closest)
    })
}, [coordinates, reports]);

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
    const handleLocationChange = async (event) => {
    const value = event.target.value;
    setLocation(value);
    // it only starts seaches when theres 3 values
    if (value.trim().length < 3) {
        setSuggestions([]);
        setShowSuggestions(false);
        return
    }

    try {
        const response = await fetch(`http://localhost:3000/geocode/suggestions?address=${encodeURIComponent(value)}`,{
        headers: {Authorization: `Bearer ${user.token}`}
        })
        const data = await response.json();
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
}
    const selectLocation = (place) => {
    // show the selected address in the input
    setLocation(place.name);
    // moving the map to the selected location
    setCoordinates({
        latitude: Number(place.latitude),
        longitude: Number(place.longitude)
    });
    setSuggestions([]);
    setShowSuggestions(false);
}

    return (
        <DashboardLayout>
            <div className="user-dashboard">
                <div className="dashboard-top">
             <div className="location-search">

            <button className="location-button" onClick={getMyLocation}>
                <img src="./location.png" alt="My location" />
            </button>

            <div className="dashboard-location-input">
                <input type="text" value={location} placeholder="Search for a location" onChange={handleLocationChange}/>
                    {showSuggestions && suggestions.length > 0 && (
                        <div className="dashboard-location-suggestions">
                            {suggestions.map((place, index) => (
                                <div key={index} className="dashboard-location-suggestion" onClick={() => selectLocation(place)}>{place.name}</div>
                            ))}

                        </div>
                    )}
                </div>
            </div>
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
                                <button className="logout" onClick={logout}> Logout</button>
                            </div>

                            <button className="profile-done" onClick={() => setShowProfile(false)}>Close </button>
                        </div>
                    </div>
                )}

                <div className="map-container">
                    <MapContainer center={defaultLocation} zoom={12} className="user-map">
                    <TileLayer attribution="&copy; OpenStreetMap contributors" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
                        <ChangeMapLocation coordinates={coordinates}/>
                        {coordinates.latitude !== null && coordinates.longitude !== null && (
                        <Marker position={[ coordinates.latitude, coordinates.longitude]}icon={userLocationIcon}>
                        <Popup><b>Selected Location</b></Popup>
                        </Marker>
                    )}
            {reports.map((report) => {
            if ( report.latitude === null || report.latitude === undefined || report.longitude === null || report.longitude === undefined) {
                return null
            }
            return (
                <Marker key={report._id} position={[Number(report.latitude),Number(report.longitude)]} icon={ potholeIcon }>
                    <Popup>
                        <p>Location:{report.location}</p>
                        <p>Severity:{report.severity}</p>
                        <p>Status:{report.status}</p>
                    </Popup>
                </Marker>
            )
         })}
            </MapContainer>
            </div>
                {coordinates.latitude !== null && (<p className="coordinates">Latitude: {coordinates.latitude} Longitude: {coordinates.longitude}</p>)}
                
            <div className="detection-section">
            <div className="location-button"><img src="./warning.jpg"/></div>

         <div className="detection-message">
         {nearestPothole ? (
            <>
                <strong>Nearby Pothole Alert</strong>
                <br />
                Location: {nearestPothole.location}
                <br />
                Severity: {nearestPothole.severity}
                <br />
                Distance: {nearestPothole.distance} km away
                <br />
                Status: {nearestPothole.status}
            </>
         ) : (
            "No nearby potholes detected."
         )}
         </div>
         </div>

         <div className="report-section">
         <div className="location-button"><img src="camera.webp"/></div>
            <button className="report-pothole-button" onClick={handleReport}>Report Pothole</button>
            </div>
         </div >
        </DashboardLayout >
    )
}
export default UserDashboard