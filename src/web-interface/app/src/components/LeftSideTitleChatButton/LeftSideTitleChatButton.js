import React from "react";
import "./LeftSideTitleChatButton.css";

function ChatListObject({ title, isSelected, onSelect, setIsNewChat }) {
    return (
        <li className="ChatListObject">
            <button
                className={`TitleButton ${isSelected ? "clicked" : ""}`}
                onClick={() => {
                    onSelect();
                    setIsNewChat(false);
                }}
            >
                {title}
            </button>
        </li>
    );
}

export default ChatListObject;
