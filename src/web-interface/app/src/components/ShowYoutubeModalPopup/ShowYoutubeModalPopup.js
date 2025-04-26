import "./ShowYoutubeModalPopup.css";

function ShowYoutubeModalPopup({ youtubeLink, setYouTubeLink, handleSaveYouTubeLink, handleCloseYouTubeModal }) {
    return (
        <div className="ModalOverlay">
            <div className="ModalContent">
                <h3>Add Youtube Link</h3>
                <input
                    type="text"
                    className="YouTubeInput"
                    placeholder="Insert the YouTube link here"
                    value={youtubeLink}
                    onChange={(e) => setYouTubeLink(e.target.value)}
                />
                <div className="ModalButtons">
                    <button onClick={handleSaveYouTubeLink}>Save</button>
                    <button onClick={handleCloseYouTubeModal}>Close</button>
                </div>
            </div>
        </div>
    );
}

export default ShowYoutubeModalPopup;