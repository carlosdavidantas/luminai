import './App.css';
import { VscAdd } from "react-icons/vsc";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useState, useEffect, useRef } from 'react';
import MessageBubble from './components/MessageBubble';
import ChatListObject from './components/ChatListObject';

function App() {
  const [showOptions, setShowOptions] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const [showYouTubeModal, setShowYouTubeModal] = useState(false);
  const [youtubeLink, setYouTubeLink] = useState("");
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState(""); 
  const [youtubeTitle, setYouTubeTitle] = useState("");
  const [titles, setTitles] = useState([]);
  const [isNewChat, setIsNewChat] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    handleAddTitles();
  }, []);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);


  const toggleOptions = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setMenuPosition({ 
      top: rect.top + window.scrollY - 100,
      left: rect.left + window.scrollX 
    });
    setShowOptions(!showOptions);
  };

  const handleAddYouTubeLink = () => {
    setShowOptions(false);
    setShowYouTubeModal(true);
  };

  const handleCloseYouTubeModal = () => {
    setShowYouTubeModal(false);
    setYouTubeLink("");
  };

  const handleSaveYouTubeLink = async () => {
    if (youtubeLink.trim() === "") {
      alert("Please, insert a link.");
      return;
    }
    setShowYouTubeModal(false);
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:5000/load-content-from-youtube", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: youtubeLink }),
      });
  
      if (!response.ok) {
        throw new Error("An error occurred while loading the Youtube content.");
      }
      
      const data = await response.json();

      setYouTubeTitle(data.title);
      handleAddTitles();
      setIsNewChat(false);
    } catch (error) {
      console.error("Request error:", error);
      alert("An error occurred while trying to load the Youtube content. Error:" + error.message);
      setIsLoading(false);
      setYouTubeLink("");
      setShowYouTubeModal(true);
      setIsNewChat(true);
    } finally {
      setIsLoading(false);
      setShowYouTubeModal(false);
      setYouTubeLink("");
    }
  };

  const handleSendMessage = async (event) => {
    if (event.key === "Enter" && currentMessage.trim() !== "") {

      const newMessage = { text: currentMessage, isUser: true };
      setMessages([...messages, newMessage]);
      setCurrentMessage("");
  
      try {
        const response = await fetch("http://localhost:5000/send-question", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ question: currentMessage, title: youtubeTitle})
        });
  
        if (!response.ok) {
          throw new Error("An error occurred while sending the question to api.");
        }
  
        const data = await response.json();
  
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: data.reply, isUser: false },
        ]);
      } catch (error) {
        console.error("Request error", error);
      }
    }
  };

  const handleAddTitles = async () => {
    try {
      const response = await fetch("http://localhost:5000/get-titles", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("An error occurred while fetching the titles.");
      }

      const data = await response.json();
      console.log("Value from fetch: " + data.titles);
      setTitles([]);
      setTitles(data.titles);
    } catch (error) {
      console.error("Request error:", error);
    }
  }

  return (
    <div className="App">
      <div className="LeftSideBackground">
        <div className="TitleAndNewChatBackground">
          <h1 className="Title">Luminai</h1>
          <button className="NewChatButton" onClick={() => {
            setIsNewChat(true);
            setMessages([]);
            setYouTubeTitle("");
            handleAddTitles();
          }}>
            New chat
          </button>
        </div>

        <div className="ChatTitleListBackground">
          <ul className="ChatList">
            {titles.map((title, index) => (
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
            </div> )}

            <div ref={messagesEndRef} />
          </ul>
        </div>

        <div className="TextBoxSenderFieldBackground">
          <div className="TextBoxBackground">
          {isNewChat && (<button className="AddVideoOnChatButton" onClick={toggleOptions}>
            <VscAdd className="AddVideoIcon" />
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

      {showOptions && (
        <div 
          className="ContextMenu" 
          style={{ top: menuPosition.top, left: menuPosition.left }}
        >
          <button onClick={handleAddYouTubeLink}>
            Add Youtube Link
          </button>
          
          <button onClick={() => setShowOptions(false)}>Close</button>
        </div>
      )}

      {showYouTubeModal && (
        <div className="ModalOverlay">
          <div className="ModalContent">
            <h3>Add Youtube Link</h3>
            <input 
              type="text" 
              className="YouTubeInput" 
              placeholder="Insert the YouTube link here" 
              value={youtubeLink}
              onChange={(e) => setYouTubeLink(e.target.value)}
            />
            <div className="ModalButtons">
              <button onClick={handleSaveYouTubeLink}>Save</button>
              <button onClick={handleCloseYouTubeModal}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;