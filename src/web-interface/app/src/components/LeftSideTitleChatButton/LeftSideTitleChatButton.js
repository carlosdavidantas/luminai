import React, { useState, useEffect } from "react";
import "./LeftSideTitleChatButton.css";

function ChatListObject({ title, isSelected, onSelect, setIsNewChat }) {
    const [visibleText, setVisibleText] = useState("");

    useEffect(() => {
        if(isSelected) {
            let currentIndex = 0;

            const interval = setInterval(() => {
                if (currentIndex <= title.length) {
                    setVisibleText(title.substring(0, currentIndex));
                    currentIndex++;
                } else {
                    clearInterval(interval);
                }
            }, 50);
    
            
            return () => clearInterval(interval);
        } else {
            setVisibleText(title);
        }

    }, [title]);

    return (
        <li className="ChatListObject">
            <button
                className={`TitleButton ${isSelected ? "clicked" : ""}`}
                onClick={() => {
                    onSelect();
                    setIsNewChat(false);
                }}
            >
                {visibleText}
            </button>
        </li>
    );
}

export default ChatListObject;