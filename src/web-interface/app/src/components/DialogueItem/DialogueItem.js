import { useState, useEffect } from "react";
import { AiOutlineClose } from "react-icons/ai";
import "./DialogueItem.css";

export default function DialogueItem({title, setYouTubeTitle, isSelected, onSelect, setIsNewChat, setIsChatBeingDeleted }) {
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
        <li className={`ChatListObject ${isSelected ? "selected" : ""}`}>
            <button
                className="TitleButton"
                onClick={() => {
                    onSelect();
                    setIsNewChat(false);
                }}
            >
                {visibleText}
            </button>

            <button
                className="DeleteButton"
                onClick={(event) => {
                    const button = event.target;
                    const parent = button.closest("li");
                    const parentTitle = parent?.querySelector(".TitleButton")?.textContent;

                    setYouTubeTitle(`${parentTitle}`);
                    setIsChatBeingDeleted(true);
                }}
            >
                <AiOutlineClose   className="DeleteIcon" />
            </button>
        </li>
    );
}
