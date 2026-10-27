import { useEffect, useRef, useState } from "react";
import RoadScene from "./RoadScene";
import "../styling/DriveTransition.css";

// Total length of the animation, in ms. The CSS timeline in
// DriveTransition.css is built around this number.
const DRIVE_MS = 2800;
const REDUCED_MS = 900;

// Full-screen "drive to the dashboard" animation:
// a taxi drives in, hits a pothole, and the screen falls into it.
// When it finishes it calls onComplete (the page uses it to navigate).
function DriveTransition({ message, onComplete }) {
    const [reduced] = useState(
        () => window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false
    );
    const finish = useRef(onComplete);

    useEffect(() => {
        finish.current = onComplete;
    });

    useEffect(() => {
        const timer = setTimeout(() => {
            // lets the dashboard fade in from dark (see theme.css)
            document.body.classList.add("arriving");
            setTimeout(() => document.body.classList.remove("arriving"), 1200);
            finish.current();
        }, reduced ? REDUCED_MS : DRIVE_MS);
        return () => clearTimeout(timer);
    }, [reduced]);

    if (reduced) {
        return (
            <div className="drive-overlay reduced" role="status" aria-live="polite">
                <span className="btn-spinner" aria-hidden="true"></span>
                <p>{message}</p>
            </div>
        );
    }

    return (
        <div className="drive-overlay" role="status" aria-live="polite">
            <div className="drive-zoom">
                <RoadScene driving />
                <div className="drive-bump" aria-hidden="true">BUMP!</div>
            </div>
            <p className="drive-message">{message}</p>
            <div className="drive-fade"></div>
        </div>
    );
}

export default DriveTransition;
