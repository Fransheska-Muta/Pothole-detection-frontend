import "../styling/RoadScene.css";

// Side-view taxi, drawn as SVG so the wheels can spin with CSS.
function Car() {
    return (
        <svg className="rs-car-svg" viewBox="0 0 360 112" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="rs-beam-gradient" x1="0" x2="1" y1="0" y2="0">
                    <stop offset="0" stopColor="#fff3b0" stopOpacity="0.85" />
                    <stop offset="1" stopColor="#fff3b0" stopOpacity="0" />
                </linearGradient>
            </defs>
            <ellipse cx="155" cy="110" rx="140" ry="4" fill="#000" opacity="0.35" />
            <path className="rs-beam" d="M288 60 L360 38 L360 92 L288 76 Z" fill="url(#rs-beam-gradient)" />
            <path d="M14 84 L14 66 Q14 56 28 54 L70 50 Q88 22 128 20 L188 20 Q218 22 234 50 L268 56 Q292 60 292 76 L292 84 Q292 92 282 92 L24 92 Q14 92 14 84 Z" fill="#ffc82c" />
            <rect x="14" y="70" width="278" height="6" fill="#e0a800" />
            <path d="M84 50 Q96 29 128 28 L150 28 L150 50 Z" fill="#2a2f44" />
            <path d="M158 28 L188 28 Q210 31 224 50 L158 50 Z" fill="#2a2f44" />
            <path d="M154 28 L154 88" stroke="#c99400" strokeWidth="2" />
            <rect x="162" y="58" width="14" height="3" rx="1.5" fill="#c99400" />
            <rect x="12" y="62" width="6" height="9" rx="2" fill="#ff3b3b" />
            <rect x="280" y="62" width="12" height="9" rx="3" fill="#fff6c4" />
            <path d="M53 92 A25 25 0 0 1 103 92 Z" fill="#0f1118" />
            <path d="M207 92 A25 25 0 0 1 257 92 Z" fill="#0f1118" />
            <g className="rs-wheel">
                <circle cx="78" cy="90" r="21" fill="#14161d" />
                <circle cx="78" cy="90" r="12" fill="#cfd3e6" />
                <path d="M78 79 V101 M67 90 H89 M70.5 82.5 L85.5 97.5 M85.5 82.5 L70.5 97.5" stroke="#6b6f86" strokeWidth="2.5" />
                <circle cx="78" cy="90" r="3.5" fill="#6b6f86" />
            </g>
            <g className="rs-wheel">
                <circle cx="232" cy="90" r="21" fill="#14161d" />
                <circle cx="232" cy="90" r="12" fill="#cfd3e6" />
                <path d="M232 79 V101 M221 90 H243 M224.5 82.5 L239.5 97.5 M239.5 82.5 L224.5 97.5" stroke="#6b6f86" strokeWidth="2.5" />
                <circle cx="232" cy="90" r="3.5" fill="#6b6f86" />
            </g>
        </svg>
    );
}

// A road at dusk with a taxi, a warning sign and a pothole.
// Calm by default (used beside the login/signup forms).
// With `driving` it plays the "car hits the pothole" sequence.
function RoadScene({ driving = false }) {
    return (
        <div className={`road-scene-wrap${driving ? " is-driving" : ""}`} aria-hidden="true">
            <div className="road-scene">
                <div className="rs-sky"><div className="rs-stars"></div></div>
                <div className="rs-sun"></div>
                <div className="rs-skyline rs-skyline-far"></div>
                <div className="rs-skyline rs-skyline-near"></div>

                <div className="rs-road">
                    <div className="rs-kerb"></div>
                    <div className="rs-dashes"></div>
                    <div className="rs-edge"></div>
                </div>

                <div className="rs-world">
                    <div className="rs-sign">
                        <div className="rs-sign-pole"></div>
                        <div className="rs-sign-board"><span>!</span></div>
                    </div>
                    <div className="rs-pothole"></div>
                </div>

                <div className="rs-car-wrap">
                    <div className="rs-car">
                        <div className="rs-car-body"><Car /></div>
                    </div>
                </div>

                <div className="rs-dust-layer">
                    <i className="rs-dust rs-dust-1"></i>
                    <i className="rs-dust rs-dust-2"></i>
                    <i className="rs-dust rs-dust-3"></i>
                </div>
            </div>
        </div>
    );
}

export default RoadScene;
