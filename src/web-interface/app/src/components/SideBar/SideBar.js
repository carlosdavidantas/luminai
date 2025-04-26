import "./sideBar.css";
import ChatListObject from "../LeftSideTitleChatButton/LeftSideTitleChatButton.js";

function SideBar({ setIsNewChat, setMessages, setYouTubeTitle, handleLeftSideChatTitles, youtubeTitle, titles, setTitles }) {
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
                        <ChatListObject
                            key={index}
                            title={title}
                            isSelected={youtubeTitle === title}
                            onSelect={() => setYouTubeTitle(title)}
                            setIsNewChat={setIsNewChat}
                        />
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default SideBar;
