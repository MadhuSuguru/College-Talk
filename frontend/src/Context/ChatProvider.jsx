import { useState } from "react";
import { useEffect } from "react";
import { useContext } from "react";
import { createContext } from "react";
import { useNavigate } from "react-router-dom";

const ChatContext = createContext();
const ChatProvider = ({ children }) => {
    const [user, setUser] = useState();
    const [selectedChat, setSelectedChat] = useState();
    const [chats, setChats] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const navigate = useNavigate();
    useEffect(() => {
        const userdata = JSON.parse(localStorage.getItem("user"));
        setUser(userdata);
        if (!userdata) {
            navigate("/");
        }
    },[navigate])
    return (
        <ChatContext.Provider value={{user,setUser,selectedChat,setSelectedChat,chats, setChats,notifications, setNotifications}}>
            {children}
        </ChatContext.Provider>
    )
}

export const ChatState = () => {
    return useContext(ChatContext);
}


export default ChatProvider;