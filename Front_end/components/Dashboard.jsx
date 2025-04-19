import { Outlet, useNavigate } from "react-router-dom";
import NavSideBar from "./NavSideBar"
import "./styles.css";


export const Dashboard =()=>{
  const navigate = useNavigate();
  const handleLogout=()=>{
    localStorage.clear();
    navigate("/login");
  }
  
  return(
    <>
    
    <div className="dash-body">
      <div className="container">
        <NavSideBar/>

        <div className="main-container">
           
            <div className="top-bar">
              <div className="profile-logo">
              <img src={localStorage.getItem("imageUrl")} className="logo" alt="logo" />
              </div>
              <div className="profile-name">
                <h1>{localStorage.getItem("fullName")}</h1>
                <button className="logout-btn" onClick={handleLogout}>Log Out</button>
              </div>
            </div>
            <Outlet/>

        </div>
      </div>
    </div>
    
    </>
  )   
}