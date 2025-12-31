import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusSquare } from '@fortawesome/free-solid-svg-icons';
import { doc, setDoc } from 'firebase/firestore';
import { db, auth } from '../../needed/Firebase';
import { useState } from 'react';
import '../css/taskadd.css';

export default function TaskAdd({close, state, objToOpen}){
    const [newTaskTItle, setNewTaskTitle] = useState('init1')
    const projTaskRef = doc(db, 'users', auth.currentUser.uid, 'projects', objToOpen[0].title, 'tasks', newTaskTItle)

    const addTask = async () => {
        await setDoc(projTaskRef, {
            title: newTaskTItle,
            state: 'incomplete'
        })
    }

    const handleSubmit = (state) => {
        addTask();
        close(state)
    }

    return(
        <div className="newtask-page">
            <div className="newtask-card" onClick={(event) => {event.stopPropagation();}}>
                <h2 className='newtask-title'>New task</h2>
                <input className='title-input' type='text' placeholder='Enter the new tasks name here...' onChange={(e) => {
                    if(e.target.value.length < 2){
                        setNewTaskTitle('init')
                    }else{
                        setNewTaskTitle(e.target.value)
                    }
                }}/>
                <div className='task-add-btn' onClick={() => handleSubmit(state)}>
                    <FontAwesomeIcon icon={faPlusSquare} />
                </div>
            </div>
        </div>
    )
}