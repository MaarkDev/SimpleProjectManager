import { NavLink } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRightFromBracket, faAngleRight } from '@fortawesome/free-solid-svg-icons'
import { signOut, onAuthStateChanged } from "firebase/auth"
import { useNavigate } from "react-router-dom"
import { auth } from "../../needed/Firebase"
import { useState } from 'react'
import logo from '../../images/logo.png'
import '../css/sidebar.css'

export default function Sidebar(){
    const [isExpanded, setIsExpanded] = useState(false)
    const navigate = useNavigate()

    const handleSignOut = () => {
        signOut(auth)
    }

    const handleExpand = () => {
        setIsExpanded(!isExpanded);
    }

    const classDecider = () => {
        if(isExpanded){
            return 'sidebar expanded'
        }else{
            return 'sidebar'
        }
    }

    const buttonClassDecider = () => {
        if(isExpanded){
            return 'expand-button-expanded'
        }else{
            return 'expand-button-collapsed'
        }
    }

    onAuthStateChanged(auth, (user) => {
        if(user == null){
            navigate('/')
        }
    })

    return(
        <div className={classDecider()}>
            <div className='sidebar-header'>
                <div className='sidebar-header-inner'>
                    <div className='sidebar-logo'>
                        <img src={ logo } alt='logo' />
                    </div>
                    <div className='sidebar-heading'>
                        <h1>Simple Project Manager</h1>
                    </div>
                </div>
            </div>
            <div className='navigation' onClick={handleExpand}>
                <NavLink to="/dashboard">Dashboard</NavLink>
                <NavLink to="/projects">Your Projects</NavLink>
                <NavLink to="/personaltasks">Tasks and Notes</NavLink>
                <NavLink to="/calendar">Calendar and Events</NavLink>
            </div>
            <div className='sidebar-icons' onClick={handleSignOut}>
                <FontAwesomeIcon icon={faRightFromBracket} />
            </div>
            <div className={buttonClassDecider()} onClick={handleExpand}>
                <FontAwesomeIcon icon={faAngleRight} />
            </div>
        </div>
    )
}