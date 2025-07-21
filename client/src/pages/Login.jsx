import { useEffect, useState } from "react"
import assets from "../assets/assets"
import { AuthContext } from "../../context/AuthContext";

import { useContext } from "react";

import { useNavigate } from "react-router-dom"



export const LoginPage=()=>{
    const[currState,setCurrState]=useState("Sign up");
    const[fullname,setFullname]=useState("");
    const[email,setEmail]=useState("");
    const[password,setPassword]=useState("");
    const[bio,setBio]=useState("");
    const[isDataSubmitted,setIsDataSubmitted]=useState(false);
      const navigate = useNavigate();
    const { authUser } = useContext(AuthContext);

    const{login} =useContext(AuthContext);
    const onsubmithandler=(e)=>{
        e.preventDefault();

        if(currState==="Sign up" && !isDataSubmitted){
            setIsDataSubmitted(true);
            return;
        }
        login(currState==="Sign up" ? "signup" : "login", {fullname, email, password, bio});
    }

    useEffect(() => {
        if (authUser) {
            navigate("/");
        }
    },[authUser,navigate])

    
    return(
        <div className="min-h-screen bg-cover bg-center flex items-center justify-center gap-8 
        sm:justify-evenly max-sm:flex-col backdrop-blur-2xl">
            {/* left */}
           <img src={assets.logo_big} alt=""  className="w-[min(30vw,250px)]"/> 
           {/* right */}

           <form  onSubmit={onsubmithandler}  className="border-2 bg-white/8 text-white border-gray-500 p-6 flex
           flex-col gap-6 rounded-lg shadow-lf">
            <h2 className="font-medium text-2xl flex justify-between items-center">
                {currState}
                {isDataSubmitted && <img onClick={()=>setIsDataSubmitted(false)}
                src={assets.arrow_icon} alt="" className="w-5 cursor-pointer"/>}
                
            </h2>


           {currState==="Sign up" && !isDataSubmitted &&(
            <input onChange={(e)=>setFullname(e.target.value)} value={fullname}
            type="text" className="p-2 border text-black border-gray-500 rounded-md focus:outline-none" placeholder="Full Name" required />
           )}

           {!isDataSubmitted&&(
            <>
            <input onChange={(e)=>setEmail(e.target.value)} value={email}
            type="email" placeholder="Email Address" required 
            className="p-2 border border-gray-500 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-indigo-500"/>
             <input onChange={(e)=>setPassword(e.target.value)} value={password}
            type="password" placeholder="password" required 
            className="p-2 border border-gray-500 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </>
            
           )}
            {
                currState==="Sign up" && !isDataSubmitted && (
                    <textarea 
                    row={4} onChange={(e)=>setBio(e.target.value)} value={bio}
                    placeholder="Bio" className="p-2 border text-black border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required></textarea>
                )
            }

            <button type="submit" className="py-3 bg-gradient-to-r from-purple-400 to-violet-600 text-white
            rounded-md cursor-pointer">
                {currState==="Sign up" ?"Create Account":"Login Now"}
            </button>

             <div className="flex items-center gap-2 text-sm text-gray-500">
                <input type="checkbox"  />
                <p>Agree to the terms of use & privacy policy.</p>
             </div>

             <div className="flex flex-col gap-2">
                 {currState==="Sign up" ?(
                    <p className="text-sm text-gray-600">Already have an account? <span
                    onClick={()=>{setCurrState("Login"); setIsDataSubmitted(false)}}
                    className="font-medium text-violet-500 cursor-pointer">Login here</span></p>
                 ):(
                    <p className="text-sm text-gray-600"> Create new account <span  
                    onClick={()=>{setCurrState("Sign up")}}
                    className="font-medium text-violet-500 cursor-pointer">Click here   </span></p>
                 )}
             </div>

           </form>
           
        </div>
    )
}