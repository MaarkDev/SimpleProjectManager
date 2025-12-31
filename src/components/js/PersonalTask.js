import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan, faCheckSquare } from '@fortawesome/free-solid-svg-icons';
import '../css/personaltask.css';

export default function PersonalTask({ title, desc, important, state, deleteHandler, taskDoneHandler }){
    return(
        <div className='p-task-container'>
            <div className='p-task-container-start'></div>
            <div className='p-task-info'>
                <div className='p-task-title'>
                    <h2>{title}</h2>

                    {
                    important ?
                        <div className='pr-indicator'>
                            <p>Important</p>
                        </div> : <></>
                    }

                </div>
                <div className='p-task-desc'>
                    <p>{desc}</p>
                </div>
            </div>
            <div className='p-task-icons'>
                <div className='p-task-delete'><FontAwesomeIcon icon={faTrashCan} onClick={() => deleteHandler(title)} /></div>
                <div className='p-task-done'><FontAwesomeIcon icon={faCheckSquare} onClick={() => taskDoneHandler(title, state)}/></div>
            </div>
        </div>
    )
}