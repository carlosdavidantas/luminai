import "./ChatMessageBubble.css";

export default function ChatMessageBubble({ text, isUser }) {
    return (
        <li className={`MessageBubble ${isUser ? "UserMessage" : "LLMMessage"}`}>
            { text }
        </li>
    );
}
