import "./ShowYoutubeModalPopup.css";

function ShowYoutubeModalPopup({ youtubeLink, setYouTubeLink, handleSaveYouTubeLink, handleCloseYouTubeModal }) {
    return (
        <div className="ModalOverlay">
            <div className="ModalContent">
                <div className="MessageContainer">
                    <h3>Add Youtube Link</h3>
                </div>

                <div className="InputContainer">
                    <input
                        type="text"
                        className="YouTubeInput"
                        placeholder="Insert the YouTube link here"
                        value={youtubeLink}
                        onChange={(e) => setYouTubeLink(e.target.value)}
                    />
                </div>

                <div className="ModalButtons">
                    <button onClick={handleCloseYouTubeModal}>Close</button>
                    <button onClick={handleSaveYouTubeLink}>Save</button>
                </div>
            </div>
        </div>
    );
}

export default ShowYoutubeModalPopup;