import { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import toast from "react-hot-toast";

  export const ChatContext=createContext();

  export const ChatProvider = ({ children }) => {
      const[message,setMessage]=useState([]);
      const[users,setUsers]=useState([]);
      const[selectedUser,setSelectedUser]=useState(null);
      const[unseenMessages,setUnseenMessages]=useState({});

      const{socket,axios}=useContext(AuthContext);

      //function to get all messages for a specific user

      const getUsers=async()=>{
        try {
            const {data}=await axios.post(`/api/messages/users`);
            if(data.success){
                setUsers(data.users);
                setUnseenMessages(data.unseenMessages);
            }
        } catch (error) {
            toast.error(error.message);
        }
      }

      //functionto get message for selected user
      const getMessages=async(userId)=>{
        try {
           const {data}= await axios.post(`/api/messages/${userId}`);
           if(data.success){
               setMessage(data.messages);
           }  
        } catch (error) {
            toast.error(error.message);
        }
      }
      //function to send message to selected user
      const sendMessage=async(messageData)=>{
        try {
            const {data}=await axios.post(`/api/messages/send/${selectedUser._id}`,messageData);
            if(data.success){
                setMessage((prevMessages) => [...prevMessages, data.newMessage]);
                
            }else{
                toast.error(data.message);
            }
                
            
        } catch (error) {
             toast.error(data.message);
        }
      }
      //function to subscribe to a mesasge for selected user
      const subscribeToMessage=()=>{
        if(!socket) return;
        socket.on("newMesasage", (newMessage) => {
            if (selectedUser && newMessage.senderId === selectedUser._id) {
                setMessage((prevMessages) => [...prevMessages, newMessage]);
                axios.put(`/api/messages/mark/${newMessage._id}`);
            }
            else{
                setUnseenMessages((prev) => ({
                    ...prev,
                    [newMessage.senderId]: prev[newMessage.senderId] ?prev[newMessage.selectedUser] + 1:1
                }));
            }
        })
      }

      //unsubscribe from message

      const unsubscribeFromMessage=()=>{
        if(socket) socket.off("newMesasage");

      }

      useEffect(()=>{
        subscribeToMessage();
        return () => {
            unsubscribeFromMessage();
        }
      },[socket, selectedUser])
        
            
                

       const value={
        message,
        
        users,
       
        selectedUser,
       getUsers,
        
        setMessage,
        sendMessage,
        setSelectedUser,
        unseenMessages,
        setUnseenMessages,
        
}

    return <ChatContext.Provider value={value}>
        {children}
    </ChatContext.Provider>
  }