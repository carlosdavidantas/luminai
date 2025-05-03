import "./sideBar.css";
import ChatTitleItem from "../LeftSideTitleChatButton/LeftSideTitleChatButton.js";

function SideBar({ setIsNewChat, setMessages, setYouTubeTitle, handleLeftSideChatTitles, youtubeTitle, titles, setTitles, setIsChatBeingDeleted }) {
    return (
        <div className="LeftSideBackground">
            <div className="TitleAndNewChatBackground">
                <h1 className="Title">Luminai</h1>
                <button className="NewChatButton" onClick={() => {
                    setIsNewChat(true);
                    setMessages([]);
                    setYouTubeTitle("");
                    handleLeftSideChatTitles(setTitles);
                }}>
                    New chat
                </button>
            </div>

            <div className="ChatTitleListBackground">
                <ul className="ChatList">
                    {titles && titles.map((title, index) => (
                        <ChatTitleItem
                            key={index}
                            title={title}
                            setYouTubeTitle={setYouTubeTitle}
                            isSelected={youtubeTitle === title}
                            onSelect={() => setYouTubeTitle(title)}
                            setIsNewChat={setIsNewChat}
                            setIsChatBeingDeleted={setIsChatBeingDeleted}
                        />
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default SideBar;
