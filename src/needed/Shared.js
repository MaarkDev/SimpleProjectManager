import { Outlet } from "react-router-dom";
import { auth } from "./Firebase"; 
import { useEffect, useState } from "react";
import Sidebar from "../components/js/Sidebar";
import '../App.css';

export default function Shared(){
    const [photoURL, setPhotoURL] = useState()

    useEffect(() => {
        auth.onAuthStateChanged((user) => {
            setPhotoURL(user.photoURL)
        })
    }, [])

    return(
        <div className="page">
            <Sidebar />
            <div className="shared-header">
                    <div className="user-pfp">
                        <img className="top-photo-url" src={photoURL} alt='user-pfp'/>
                    </div>
                </div>
            <div className="main">
                <Outlet />
            </div>
        </div>
    )
}