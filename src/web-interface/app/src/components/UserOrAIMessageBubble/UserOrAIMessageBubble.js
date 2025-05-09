import React from "react";
import "./UserOrAIMessageBubble.css";

function MessageBubble({ text, isUser }) {
    return (
        <li className={`MessageBubble ${isUser ? "UserMessage" : "LLMMessage"}`}>
            { text }
        </li>
    );
}

export default MessageBubble;
