import { slug } from "../utils/ui";

const LEVELS = { small: 1, medium: 2, large: 3 };

// Severity: three pips, filled up to the level, plus the word.
export function SeverityBadge({ value }) {
    if (!value) {
        return null;
    }
    const level = LEVELS[slug(value)] || 0;
    return (
        <span className={`dx-sev ${slug(value)}`}>
            <span className="dx-pips" aria-hidden="true">
                {[1, 2, 3].map((n) => <i key={n} className={n <= level ? "on" : ""}></i>)}
            </span>
            {value}
        </span>
    );
}

// Status: a rubber stamp.
export function StatusBadge({ value, big }) {
    if (!value) {
        return null;
    }
    return <span className={`dx-stamp ${slug(value)}${big ? " big" : ""}`}>{value}</span>;
}