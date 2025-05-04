import "./ShowDeleteConfirmationModalPopup.css";

function ShowDeleteConfirmationModalPopup({ handleDeleteLeftSideChatTitles, setTitles, youtubeTitle, setIsChatBeingDeleted, setIsNewChat, setMessages, setYouTubeTitle }) {
    return (
        <div className="modalOverlay">
            <div className="modalBackground">
                <div className="messageContainer">
                    <h3>Confirm chat deletion?</h3>
                </div>
                <div className="buttonContainer">
                    <button
                        className="cancelButton"
                        onClick={() => setIsChatBeingDeleted(false)}
                    >
                        Cancel
                    </button>

                    <button
                        className="confirmButton"
                        onClick={async () => {
                            console.log("Deleting chat with title:", youtubeTitle);
                            await handleDeleteLeftSideChatTitles(youtubeTitle, setTitles);
                            setIsChatBeingDeleted(false)
                            setIsNewChat(true);
                            setMessages([]);
                            setYouTubeTitle("");
                        }}
                    >
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ShowDeleteConfirmationModalPopup;