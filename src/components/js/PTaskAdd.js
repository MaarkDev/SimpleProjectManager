import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquareXmark } from '@fortawesome/free-solid-svg-icons';
import { setDoc, doc } from 'firebase/firestore';
import { auth, db } from '../../needed/Firebase';
import '../css/ptaskadd.css';

export default function PTaskAdd({ showPTaskAdd, setShowPTaskAdd, rerender, setRerender}){

    const hide = () => {
        setShowPTaskAdd(!showPTaskAdd);
        setRerender(!rerender);
    }

    const submitHandler = async (e) => {
        e.preventDefault();
        const newPTaskRed = doc(db, 'users', auth.currentUser.uid, 'tasks', e.target[0].value);
        await setDoc(newPTaskRed, {
            title: e.target[0].value,
            desc: e.target[1].value,
            important: e.target[2].checked,
            state: 'incomplete'
        })
        hide();
    }

    return(
        <div className='p-task-add-page' onClick={hide}>
            <div className='p-task-add-card' onClick={(event) => {event.stopPropagation()}}>
                <form className='p-task-add-form' id='newPTaskForm' onSubmit={submitHandler}>
                    <input className='p-task-title-in input-title' type='text' placeholder='Task title...' required/>
                    <textarea className='p-task-desc-in input-desc' placeholder='Provide a description for the task...' />
                    <div className='checkbox-div'>
                        <input type='checkbox' className='p-task-checkbox' />
                    </div>
                    <div className='card-buttons p-task-add-buttons'>
                        <div className='cancel-button' onClick={hide}>
                            <FontAwesomeIcon icon={faSquareXmark} />
                        </div>
                        <input type="submit" value="Save" className='save-btn' form='newPTaskForm'></input>
                    </div>
                </form>
            </div>
        </div>
    )
}