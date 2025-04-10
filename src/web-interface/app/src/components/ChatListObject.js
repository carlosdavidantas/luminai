import React, { useState } from "react";
import "./ChatListObject.css";

function ChatListObject({ title, isSelected, onSelect }) {
    return (
        <li className="ChatListObject">
            <button
                className={`TitleButton ${isSelected ? "clicked" : ""}`}
                onClick={() => {
                    onSelect();
                }}
            >
                {title}
            </button>
        </li>
    );
}

export default ChatListObject;
