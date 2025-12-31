import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckSquare, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { doc, updateDoc, getDoc, deleteDoc } from 'firebase/firestore';
import { db, auth } from '../../needed/Firebase';
import { useEffect, useState } from 'react';
import '../css/taskcard.css';

export default function TaskCard({ title, projectName, setDeleteTitle, setRerender, rerender }){
    const currentTaskRef = doc(db, 'users', auth.currentUser.uid, 'projects', projectName, 'tasks', title);
    const [taskData, setTaskData] = useState(null);

    const setTaskState = async () => {
        console.log("FETCHING A SINGLE TASK BECAUSE TASK STATE CHANGE");
        const task = await getDoc(currentTaskRef)
        if(task.data().state === 'incomplete'){
            await updateDoc(currentTaskRef, {state: 'complete'})
        }else{
            await updateDoc(currentTaskRef, {state: 'incomplete'})
        }
        setRerender(!rerender)
    }

    const getTask = async () => {
        console.log("FETCHING A SINGLE TASK");
        const task = await getDoc(currentTaskRef)
        setTaskData(task.data());
    }


    const deleteHandler = async (title) => {
        setDeleteTitle(title);
        await deleteDoc(doc(db, 'users', auth.currentUser.uid, 'projects', projectName, 'tasks', title)); 
    }

    const classDecider = () => {
        if(taskData && taskData.state === 'complete'){
            return 'task-check is-complete';
        }else{
            return 'task-check';
        }
    }

    const startClassDecider = () => {
        if(taskData && taskData.state === 'complete'){
            return 'task-start is-complete';
        }else{
            return 'task-start';
        }
    }

    useEffect(() => {
        getTask();
    //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return(
        <div className='task-outer-wrapper'>
            <div className={startClassDecider()}></div>
            <div className='task-title'>
                <p>
                    {title}
                </p>
            </div>
            <div className='task-card-icons'>
                <div className='task-delete'>
                    <FontAwesomeIcon icon={faTrashCan} onClick={() => deleteHandler(title)}/>
                </div>
                <div className={classDecider()}>
                    <FontAwesomeIcon icon={faCheckSquare} onClick={() => setTaskState()}/>
                </div>
            </div>
        </div>
    )
}