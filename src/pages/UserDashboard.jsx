import API_URL from "../config";
import { useState, useEffect } from "react";
import { useAuth } from "../context/useAuth";
import DashboardLayout from "../components/DashboardLayout";
import { SeverityBadge, StatusBadge } from "../components/Badges";
import "../styling/Loader.css";
import { useNavigate } from "react-router-dom";
import "leaflet/dist/leaflet.css";
import "../styling/UserDashboard.css";
import { MapContainer, TileLayer, Marker, Popup, useMap} from "react-leaflet";
import L from "leaflet"
import MyLocationIcon from "@mui/icons-material/MyLocation";
import SearchIcon from "@mui/icons-material/Search";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";

const defaultLocation = [-26.2041, 28.0473];

// A report only goes on the map / into the nearest-pothole check if both
// coordinates are real numbers. Reports saved without a picked location can
// hold null, "null" or "" - Leaflet crashes on those (Invalid LatLng NaN).
const toCoordinate = (value) => (value === null || value === undefined || value === "" ? NaN : Number(value));
const hasValidCoordinates = (report) => Number.isFinite(toCoordinate(report.latitude)) && Number.isFinite(toCoordinate(report.longitude));
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

const formatDistance = (km) => {
    const value = Number(km);
    if (value < 0.01) {
        return { amount: "<10", unit: "m" };
    }
    if (value < 1) {
        return { amount: Math.round(value * 1000), unit: "m" };
    }
    return { amount: value >= 100 ? Math.round(value) : value.toFixed(1), unit: "km" };
};

function UserDashboard() {
    const navigate = useNavigate()
    const { user } = useAuth()
    const [location, setLocation] = useState("");
    const [coordinates, setCoordinates] = useState({latitude: null,longitude: null});
    const [reports, setReports] = useState([])
    const [nearestPothole, setNearestPothole] = useState(null);
    const [suggestions, setSuggestions] = useState([]);
    const [locating, setLocating] = useState(false);
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
            const response = await fetch(`${API_URL}/reports`,{
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
        if (!hasValidCoordinates(report)) {
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
        setLocating(true);
        navigator.geolocation.getCurrentPosition(
            (position) => {
            const latitude = position.coords.latitude
            const longitude = position.coords.longitude
            // console.log("Latitude:", latitude)
            // console.log("Longitude:", longitude)
            setCoordinates({ latitude, longitude})
            setLocation("My location")
            setLocating(false)
            },
            () => setLocating(false) // permission denied / failed: stop the spinner
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
        const response = await fetch(`${API_URL}/geocode/suggestions?address=${encodeURIComponent(value)}`,{
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

    // ---- display only ----
    const hasLocation = coordinates.latitude !== null && coordinates.longitude !== null;
    const isClose = nearestPothole ? Number(nearestPothole.distance) <= 1 : false;
    const distanceLabel = nearestPothole ? formatDistance(nearestPothole.distance) : null;
    const statusCounts = [
        { key: "pending", label: "Pending", count: reports.filter((report) => report.status === "Pending").length },
        { key: "in-progress", label: "In Progress", count: reports.filter((report) => report.status === "In Progress").length },
        { key: "resolved", label: "Resolved", count: reports.filter((report) => report.status === "Resolved").length }
    ];

    return (
        <DashboardLayout>
            <div className="dx-page ud-page">
                <div className="dx-head">
                    <div>
                        <p className="dx-eyebrow">Live road map</p>
                        <h1>Potholes near you</h1>
                        <p className="dx-lede">Search an address or use your location to see what has been reported on the road ahead.</p>
                    </div>
                </div>

                <div className="ud-search">
                    <div className="dashboard-location-input">
                        <SearchIcon className="ud-search-icon" />
                        <input type="text" value={location} placeholder="Search location" aria-label="Search location" onChange={handleLocationChange}/>
                    </div>
                    <button className={`dx-btn plain ud-locate${locating ? " is-loading" : ""}`} onClick={getMyLocation} disabled={locating} aria-label="Use my location">
                        {locating ? <span className="btn-spinner" aria-label="Finding your location"></span> : <MyLocationIcon fontSize="small" />}
                        <span>Use my location</span>
                    </button>
                    {showSuggestions && suggestions.length > 0 && (
                        <div className="dashboard-location-suggestions">
                            {suggestions.map((place, index) => (
                                <div key={index} className="dashboard-location-suggestion" onClick={() => selectLocation(place)}>{place.name}</div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="ud-map-wrap">
                    <div className="ud-map-frame">
                        <MapContainer center={defaultLocation} zoom={12} className="user-map">
                            <TileLayer attribution="&copy; OpenStreetMap contributors" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
                            <ChangeMapLocation coordinates={coordinates}/>
                            {hasLocation && (
                                <Marker position={[ coordinates.latitude, coordinates.longitude]} icon={userLocationIcon}>
                                    <Popup><b>Selected Location</b></Popup>
                                </Marker>
                            )}
                            {reports.map((report) => {
                                if (!hasValidCoordinates(report)) {
                                    return null
                                }
                                return (
                                    <Marker key={report._id} position={[Number(report.latitude),Number(report.longitude)]} icon={potholeIcon}>
                                        <Popup>
                                            <div className="ud-popup">
                                                <strong>{report.location}</strong>
                                                <SeverityBadge value={report.severity} />
                                                <StatusBadge value={report.status} />
                                            </div>
                                        </Popup>
                                    </Marker>
                                )
                            })}
                        </MapContainer>
                    </div>
                </div>

                <div className="ud-mapmeta">
                    <div className="ud-legend" aria-hidden="true">
                                <span><i className="key pin"></i>Pothole</span>
                                <span><i className="key pin you"></i>You</span>
                            </div>
                    {hasLocation && (<p className="ud-coords">Latitude: {coordinates.latitude} &nbsp; Longitude: {coordinates.longitude}</p>)}
                </div>

                <div className="ud-block">
                    <section className={`ud-cell ud-near${isClose && hasLocation ? " is-close" : ""}`}>
                        <p className="ud-cell-label">Nearest pothole</p>
                        {!hasLocation ? (
                            <p className="ud-cell-text">Pick a place above or use your location, and the closest reported pothole will appear here.</p>
                        ) : nearestPothole ? (
                            <div className="ud-near-body">
                                <p className="ud-distance"><b>{distanceLabel.amount}</b><span>{distanceLabel.unit} away</span></p>
                                <div>
                                    <p className="ud-near-place">{nearestPothole.location}</p>
                                    <div className="ud-near-meta">
                                        <SeverityBadge value={nearestPothole.severity} />
                                        <StatusBadge value={nearestPothole.status} />
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <p className="ud-cell-text">No nearby potholes detected.</p>
                        )}
                    </section>

                    <section className="ud-cell ud-counts-cell">
                        <p className="ud-cell-label">On the map</p>
                        <p className="ud-total"><b>{reports.length}</b> {reports.length === 1 ? "report" : "reports"}</p>
                        <ul className="ud-counts">
                            {statusCounts.map((item) => (
                                <li key={item.key}><i className={`key ${item.key}`}></i>{item.label}<b>{item.count}</b></li>
                            ))}
                        </ul>
                    </section>

                    <section className="ud-cell ud-cta">
                        <p className="ud-cell-label">Not on the map?</p>
                        <p className="ud-cell-text">Spotted one that has not been reported yet?</p>
                        <button className="dx-btn yellow block ud-report" onClick={handleReport}><PhotoCameraIcon fontSize="small" /> Report Pothole</button>
                    </section>
                </div>
            </div>
        </DashboardLayout>
    )
}
export default UserDashboard