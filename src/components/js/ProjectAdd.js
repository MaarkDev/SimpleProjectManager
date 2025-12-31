import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquareXmark } from '@fortawesome/free-solid-svg-icons';
import { useState, useEffect } from 'react';
import { doc, setDoc } from 'firebase/firestore';
import { db, auth } from '../../needed/Firebase';
import '../css/projectadd.css';

export default function ProjectAdd({ hide, setCloseEvent, closeEvent }){
    const [activePr, setActivePr] = useState('med')
    const [blueRa, setBlueRa] = useState('custom-radio low');
    const [greenRa, setGreenRa] = useState('custom-radio med');
    const [redRa, setRedRa] = useState('custom-radio high');
    const [uid, setUid] = useState();

    useEffect(() => {
        setUid(auth.currentUser.uid);
    }, [])


    function handleActivePr(e){
        if(e.target.id === 'low'){
            setBlueRa('custom-radio low-active')
            setActivePr('low')
            setGreenRa('custom-radio med')
            setRedRa('custom-radio high')
        }else if(e.target.id === 'med'){
            setBlueRa('custom-radio low')
            setGreenRa('custom-radio med-active')
            setActivePr('med')
            setRedRa('custom-radio high')
        }else if(e.target.id === 'high'){
            setBlueRa('custom-radio low')
            setGreenRa('custom-radio med')
            setRedRa('custom-radio high-active')
            setActivePr('high')
        }
    }

    async function handleForm(e){
        e.preventDefault();
        const title = e.target[0].value;
        const desc = e.target[1].value;
        const deadline = e.target[2].value;
        const budget = e.target[3].value;
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        const newDateFormat = year + '-' + month + '-' + day;

        const projectDocRef = doc(db, 'users', uid, 'projects', title);
        await setDoc(projectDocRef, {
            title: title,
            desc: desc,
            priority: activePr,
            deadline: deadline,
            budget: budget,
            dateCreated: newDateFormat,
            state: 'incomplete'
        })

        setDoc(doc(db, 'users', uid, 'projects', title, 'tasks', 'init'), {
            init: 'init'
        })
        setDoc(doc(db, 'users', uid, 'projects', title, 'collab', 'init'), {
            init: 'init'
        })

        setCloseEvent(!closeEvent);
        hide();
    }

    return(
        <div className='project-add-card-bg' onClick={() => {setCloseEvent(!closeEvent); hide()}}>
            <div className="project-add-card" onClick={(event) => {event.stopPropagation()}}>
                
                <form id='newProjForm' onSubmit={handleForm}>
                    <input title='title' type='text' placeholder='Project title...' className='input-title' required></input>
                    <textarea title='desc' placeholder='Provide a brief description of your project...' className='input-desc' autoFocus></textarea>
                </form>
                <div className='form-right'>

                    <div className='form-right-div'>
                        <label><p>Priority</p></label>
                        <div className='pr-radios'>
                            <div className={blueRa} onClick={handleActivePr}><p id='low'>Low</p></div>
                            <div className='custom-radio-divider'></div>

                            <div className={greenRa} onClick={handleActivePr}><p id='med'>Medium</p></div>
                            <div className='custom-radio-divider'></div>

                            <div className={redRa} onClick={handleActivePr}><p id='high'>High</p></div>
                        </div>
                    </div>

                    <div className='form-right-div'>
                        <label><p>Deadline</p></label>
                        <input type='date' className='pr-add-cal' form='newProjForm'></input>
                    </div>             

                    <div className='card-buttons'>
                        <div className='cancel-button' onClick={() => {setCloseEvent(!closeEvent); hide()}}>
                            <FontAwesomeIcon icon={faSquareXmark} />
                        </div>
                        <input type="submit" value="Save" className='save-btn' form='newProjForm'></input>
                    </div>
                </div>
            </div>
        </div>
    )
}