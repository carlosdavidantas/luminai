import "./ShowMediaOptionsPopup.css";

function showMediaOptionsPopup({ menuPosition, handleAddYouTubeLink, setShowOptions }) {
    return (
        <div
            className="ContextMenu"
            style={{ top: menuPosition.top, left: menuPosition.left }}
        >
            <button onClick={handleAddYouTubeLink}>
                Add Youtube Link
            </button>
            <button onClick={() => setShowOptions(false)}>Close</button>
        </div>
    );
}

export default showMediaOptionsPopup;
