import { Navigate, Route, Routes } from "react-router-dom"
import { HomePage } from "./pages/Home"
import { LoginPage } from "./pages/Login"
import { ProfilePage } from "./pages/Profile"
import {Toaster} from "react-hot-toast"
import { useContext } from "react"
import { AuthContext } from "../context/AuthContext.jsx"

export const App=()=>{
  const{authUser}=useContext(AuthContext)
  return(
    <>
    <div className="bg-[url('./src/assets/bgImage.svg')] bg-contain  ">
    <Toaster/>
      <Routes>
        <Route path="/" element={authUser?<HomePage/>:<Navigate to="/login"/>}/>
         <Route path="/login" element={!authUser?<LoginPage/>:<Navigate to="/"/>}/>
          <Route path="/profile" element={authUser?<ProfilePage/>:<Navigate to="/login"/>}/>
      </Routes>
    </div>
    </>
  )
}