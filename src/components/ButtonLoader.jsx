import "../styling/Loader.css";

// Swaps a button's label for a small spinner (and optional text) while a
// request is on its way. Purely visual - it never touches request logic.
function ButtonLoader({ loading, loadingText, children }) {
    if (!loading) {
        return children;
    }
    return (
        <>
            <span className="btn-spinner" aria-hidden="true"></span>
            {loadingText ? <span className="btn-loading-text">{loadingText}</span> : null}
        </>
    );
}

export default ButtonLoader;
