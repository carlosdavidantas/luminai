import "./ChatWindow.css";
import { VscAdd } from "react-icons/vsc";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import MessageBubble from "../UserOrAIMessageBubble/UserOrAIMessageBubble.js";

function ChatWindow({ messages, isLoading, messagesEndRef, isNewChat, toggleMidiaOptions, currentMessage, setCurrentMessage, handleSendMessage }) {
    return (
        <div className="ChatBackground">
            <div className="MessagesBackground">
                <ul className="MessagesList">
                    {messages.map((message, index) => (
                        <MessageBubble
                            key={index}
                            text={message.text}
                            isUser={message.isUser}
                        />
                    ))}

                    {isLoading && (<div className="LoadingIconContainer">
                        <AiOutlineLoading3Quarters className="LoadingIcon" />
                    </div>)}

                    <div ref={messagesEndRef} />
                </ul>
            </div>

            <div className="TextBoxSenderFieldBackground">
                <div className="TextBoxBackground">
                    {isNewChat && (<button className="AddMidiaButton" onClick={toggleMidiaOptions}>
                        <VscAdd className="AddMidiaIcon" />
                    </button>)}
                    <input
                        type="text"
                        placeholder="Ask something here"
                        className="TextBoxInput"
                        value={currentMessage}
                        onChange={(e) => setCurrentMessage(e.target.value)}
                        onKeyDown={handleSendMessage}
                        disabled={isLoading}
                    />
                </div>
            </div>
        </div>
    );
}

export default ChatWindow;
