import { useState } from "react";
import { TbLayoutSidebarLeftCollapse } from "react-icons/tb";
import { TbLayoutSidebarLeftExpand } from "react-icons/tb";
import "./sideBar.css";
import DialogueItem from "../DialogueItem/DialogueItem.js";

function SideBar({ setIsNewChat, setMessages, setYouTubeTitle, handleLeftSideChatTitles, youtubeTitle, titles, setTitles, setIsChatBeingDeleted }) {
    const [collapsed, setCollapsed] = useState(false);
    return (
        <div className={`LeftSideBackground${collapsed ? " collapsed" : ""}`}>
            <button 
                className="SidebarToggleButton"
                onClick={() => setCollapsed(!collapsed)}
            >
                {collapsed ? (
                    <TbLayoutSidebarLeftExpand className="SidebarToggleButtonIcon" />
                ) : (
                    <TbLayoutSidebarLeftCollapse className="SidebarToggleButtonIcon" />
                )}
            </button>
            <div className={`HideOnCollapse${collapsed ? " hidden" : ""}`}>
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
                            <DialogueItem
                                key={index}
                                title={title}
                                setYouTubeTitle={setYouTubeTitle}
                                isSelected={youtubeTitle === title}
                                onSelect={() => setYouTubeTitle(title)}
                                setIsNewChat={setIsNewChat}
                                setIsChatBeingDeleted={setIsChatBeingDeleted}
                            />
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default SideBar;