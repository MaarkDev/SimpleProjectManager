import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan, faCheckSquare } from '@fortawesome/free-solid-svg-icons';
import '../css/personaltask.css';

export default function NoPTaskCard(){
    return(
        <div className='p-task-container'>
            <div className='p-task-container-start'></div>
            <div className='p-task-info'>
                <div className='p-task-title'>
                    <h2>No tasks yet...</h2>
                </div>
                <div className='p-task-desc'>
                    <p>Click 'Add a new task' to create a new task.</p>
                </div>
            </div>
            <div className='p-task-icons'>
                <div className='p-task-delete'><FontAwesomeIcon icon={faTrashCan} /></div>
                <div className='p-task-done'><FontAwesomeIcon icon={faCheckSquare} /></div>
            </div>
        </div>
    )
}