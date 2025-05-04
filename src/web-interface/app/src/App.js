import './styles/App.css';
import { useState, useEffect, useRef } from 'react';
import { handleLeftSideChatTitles, handleChatHistory, handleDeleteLeftSideChatTitles } from './utils/appScrips.js';
import SideBar from "./components/SideBar/SideBar.js";
import ChatWindow from "./components/ChatWindow/ChatWindow.js";
import ShowMediaOptionsPopup from "./components/ShowMediaOptionsPopup/ShowMediaOptionsPopup.js";
import ShowYoutubeModalPopup from "./components/ShowYoutubeModalPopup/ShowYoutubeModalPopup.js";
import ShowDeleteConfirmationModalPopup from "./components/ShowDeleteConfirmationModalPopup/ShowDeleteConfirmationModalPopup.js";

function App() {
  // Hooks
  const [showOptions, setShowOptions] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const [showYouTubeModal, setShowYouTubeModal] = useState(false);
  const [youtubeLink, setYouTubeLink] = useState("");
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState(""); 
  const [youtubeTitle, setYouTubeTitle] = useState("");
  const [titles, setTitles] = useState([]);
  const [chat_history, setChatHistory] = useState([]);
  const [isNewChat, setIsNewChat] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null)
  const [isChatBeingDeleted, setIsChatBeingDeleted] = useState(false);
  
  // Effects
  useEffect(() => {
    handleLeftSideChatTitles(setTitles);
  }, []);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  useEffect(() => {
    handleChatHistory(setChatHistory, youtubeTitle);
    setMessages([]);
  },[youtubeTitle]);

  useEffect(() => {
    const messagesHistory = [];
    chat_history.forEach(element => {
      const content = element.data.content;
      const userType = element.type === "human" ? true : false;
      const newMessage = { text: content, isUser: userType };
      messagesHistory.push(newMessage);
    });

    setMessages(messagesHistory);
  },[chat_history]);



  // Functions 
  const toggleMidiaOptions = (event) => {
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
      handleLeftSideChatTitles(setTitles);
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

  const sendMessage = async () => {
    if(currentMessage.trim() == "")
      return;

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

  const handleSendMessageWithEnter = async (event) => {
    if (event.key === "Enter" && currentMessage.trim() !== "") {
      await sendMessage();
    }
  };


  // Web page code
  return (
    <div className="App">
      <SideBar 
        setIsNewChat = {setIsNewChat}
        setMessages = {setMessages}
        setYouTubeTitle = {setYouTubeTitle}
        handleLeftSideChatTitles = {handleLeftSideChatTitles}
        youtubeTitle = {youtubeTitle}
        titles = {titles}
        setTitles = {setTitles}
        handleDeleteLeftSideChatTitles = {handleDeleteLeftSideChatTitles}
        setIsChatBeingDeleted = {setIsChatBeingDeleted}
      />
      <ChatWindow 
          messages={messages}
          isLoading={isLoading}
          messagesEndRef={messagesEndRef}
          isNewChat={isNewChat}
          toggleMidiaOptions={toggleMidiaOptions}
          currentMessage={currentMessage}
          setCurrentMessage={setCurrentMessage}
          handleSendMessageWithEnter={handleSendMessageWithEnter}
          sendMessage={sendMessage}
      />

      {/* Context menu to choose media */}
      {showOptions && (
        <ShowMediaOptionsPopup
          menuPosition={menuPosition}
          handleAddYouTubeLink={handleAddYouTubeLink}
          setShowOptions={setShowOptions}
        />
      )}

      {/* Modal popup for adding YouTube link. This modal will appear when the user clicks on "Add Youtube Link" */}
      {showYouTubeModal && (
        <ShowYoutubeModalPopup
          youtubeLink={youtubeLink}
          setYouTubeLink={setYouTubeLink}
          handleSaveYouTubeLink={handleSaveYouTubeLink}
          handleCloseYouTubeModal={handleCloseYouTubeModal}
        />
      )}
      {isChatBeingDeleted && (
        <ShowDeleteConfirmationModalPopup
        handleDeleteLeftSideChatTitles={handleDeleteLeftSideChatTitles}
        setTitles={setTitles}
        youtubeTitle={youtubeTitle}
        setIsChatBeingDeleted={setIsChatBeingDeleted}
        setIsNewChat={setIsNewChat}
        setMessages={setMessages}
        setYouTubeTitle={setYouTubeTitle}
        />
      )}
    </div>
  );
}

export default App;
