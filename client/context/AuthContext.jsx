import { createContext } from "react";
import axios from "axios";
import toast  from "react-hot-toast";
import { useEffect } from "react";
import {io} from "socket.io-client";
import { useState } from "react";
import { useNavigate } from "react-router-dom";



const backendUrl = import.meta.env.VITE_BACKEND_URL;

axios.defaults.baseURL = backendUrl;

export const AuthContext=createContext();

export const AuthProvider = ({ children }) => {

     const[token,setToken]=useState(localStorage.getItem("token") );
     const[authUser,setAuthUser]=useState(null);
      const[onlineuser,setOnlineuser]=useState([]);
      const[socket,setSocket]=useState(null);
       const navigate=useNavigate();


    const checkauth=async()=>{
        try {
            const {data}=await axios.get("/api/auth/check");
            if(data.success){
                setAuthUser(data.user);
                connectsocket(data.user)
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    //Login function to handle user authentication and socket connection
    const login=async(state,credentials)=>{
        try {
            const {data}=await axios.post(`/api/auth/${state}`,credentials);
            if(data.success){
                setAuthUser(data.userdata);
                connectsocket(data.userdata);
                axios.defaults.headers.common["token"]=data.token;
                setToken(data.token);
                localStorage.setItem("token",data.token);
                toast.success(data.message);
                navigate("/");
            }
            else{
                toast.error(data.message);
            }
            
          
        } catch (error) {
            toast.error(error.message);
        }
    }
    //Logut function to handle user logout and socket disconnection
         const logout=async()=>{
            localStorage.removeItem("token");
            setToken(null);
            setAuthUser(null);
            setOnlineuser([]);
            axios.defaults.headers.common["token"]=null;
            toast.success("Logout Successfully");
            socket.disconnect();
         }
    //Update user function to handle user profile updates
     const updateProfile=async(bodddy)=>{
         try {
            const {data}=await axios.put("/api/auth/update-profile",bodddy);
            if(data.success){
                setAuthUser(data.user);
                  localStorage.setItem("authUser", JSON.stringify(data.user));
                toast.success("Profile Updated Successfully");
            }
         } catch (error) {
            toast.error(error.message);
         }

     }


    //Connect socket funtion to handle socket connection and online users updates

     const connectsocket=(userDate)=>{
        if(!userDate|| socket?.connected) return;
        const newsocket=io(backendUrl,{
            query:{
                userId:userDate._id,
            }
        });
        newsocket.connect();
        setSocket(newsocket);

        newsocket.on("getOnlineUsers",(userIds)=>{
            setOnlineuser(userIds);
        })
     }

    useEffect(()=>{
        if(token){
            axios.defaults.headers.common["token"]=token;
        }
        checkauth();
        
    },[])

    const value={
      axios,
      authUser,
      onlineuser,
      socket,
      login,
      logout,
      updateProfile

    }
    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}