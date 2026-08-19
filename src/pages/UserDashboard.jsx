import { useState } from "react";
// import { useAuth } from "../context/useAuth";
import DashboardLayout from "../components/DashboardLayout";
import "../styling/UserDashboard.css";

function UserDashboard() {

    // const { user } = useAuth();

    const [location, setLocation] = useState("My location");

    const [coordinates, setCoordinates] = useState({
        latitude: null,
        longitude: null
    });

    const getMyLocation = () => {

        if (!navigator.geolocation) {

            alert("Geolocation is not supported by your browser.");

            return;
        }

        navigator.geolocation.getCurrentPosition(

            (position) => {

                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;

                console.log("Latitude:", latitude);
                console.log("Longitude:", longitude);

                setCoordinates({
                    latitude,
                    longitude
                });
                setLocation("My location");
            },

            (error) => {

                console.error("Location error:", error);

                alert("Unable to get your location.");
            }

        );
    };


    const handleReport = () => {

        console.log("Report pothole clicked");

    };


    return (

        <DashboardLayout>

            <div className="user-dashboard">

                {/* TOP BAR */}

                <div className="dashboard-top">

                    <div className="location-search">

                        <button
                            className="location-button"
                            onClick={getMyLocation}
                        >
                            📍
                        </button>

                        <input
                            type="text"
                            value={location}
                            onChange={(event) =>
                                setLocation(event.target.value)
                            }
                        />

                        <button className="search-button">
                            🔍
                        </button>

                    </div>


                    {/* PROFILE */}

                    <div className="profile-button">

                        <span>
                            ♙
                        </span>

                    </div>

                </div>


                {/* MAP */}

                <div className="map-container">

                    <div className="map-placeholder">

                        <span className="map-pin">
                            📍
                        </span>

                    </div>

                </div>


                {/* SHOW COORDINATES */}

                {coordinates.latitude && (

                    <p className="coordinates">

                        Latitude: {coordinates.latitude}
                        <br />

                        Longitude: {coordinates.longitude}

                    </p>

                )}


                {/* POTHOLE DETECTION */}

                <div className="detection-section">

                    <div className="warning-icon">
                        ⚠️
                    </div>

                    <div className="detection-message">

                        POTHOLE DETECTED ON MAIN ROAD

                    </div>

                </div>


                {/* REPORT BUTTON */}

                <div className="report-section">

                    <div className="camera-icon">
                        📸
                    </div>

                    <button
                        className="report-pothole-button"
                        onClick={handleReport}
                    >
                        Report Pothole
                    </button>

                </div>

            </div>

        </DashboardLayout>

    );
}

export default UserDashboard;