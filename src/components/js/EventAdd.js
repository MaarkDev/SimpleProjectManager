import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquareXmark } from '@fortawesome/free-solid-svg-icons';
import { db, auth } from '../../needed/Firebase';
import { setDoc, doc } from 'firebase/firestore';
import '../css/eventadd.css';

export default function EventAdd({ closeEvent }){

    const submitHandeler =  async (e) => {
        e.preventDefault();
        const newDocRef = doc(db, 'users', auth.currentUser.uid, 'events', e.target[0].value)
        await setDoc(newDocRef, {
            title: e.target[0].value,
            startDate: e.target[1].value,
            endDate: e.target[2].value
        })
        closeEvent();
    }

    return(
        <div className='event-add-page' onClick={closeEvent}>
            <div className='p-task-add-card' onClick={(event) => {event.stopPropagation()}}>
                <form className='p-task-add-form' id='newEventForm' onSubmit={submitHandeler}>
                    <input className='p-task-title-in input-title' type='text' placeholder='Event title...' required/>

                    <div className='event-add-dates'>
                        <div className='event-add-dates-left'>
                            <p className='date-desc'>Start Date</p>
                            <input type='date' required/>
                        </div>
                        <div className='event-add-dates-right'>
                            <p className='date-desc p2'>End Date</p>
                            <input type='date' required/>
                        </div>
                    </div>

                    <div className='card-buttons p-task-add-buttons'>
                        <div className='cancel-button' onClick={closeEvent}>
                            <FontAwesomeIcon icon={faSquareXmark} />
                        </div>
                        <input type="submit" value="Save" className='save-btn' form='newEventForm'></input>
                    </div>
                </form>
            </div>
        </div>
    )
}