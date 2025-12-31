import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestionCircle, faPlusSquare } from '@fortawesome/free-solid-svg-icons';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { db, auth } from '../../needed/Firebase';
import { getDocs, collection, deleteDoc, doc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { useEffect, useState } from 'react';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDate';
import EventAdd from '../../components/js/EventAdd';
import Loading from '../../components/js/Loading';
import CalendarInfo from '../../components/js/CalendarInfo';
import 'react-big-calendar/lib/css/react-big-calendar.css'
import '../css/calendarpage.css';

const locales = {
    'en-us': require('date-fns/locale/en-US')
}

const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales
})

export default function CalendarPage(){
    const [showAddEvent, setShowAddEvent] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [rerender, setRerender] = useState(false);
    const [eventsArr, setEventsArr] = useState([]);
    const [deleteTitle, setDeleteTitle] = useState('');
    const [showInfo, setShowInfo] = useState(false);

    const navigate = useNavigate();

    const closeEvent = () => {
        setShowAddEvent(!showAddEvent);
        setRerender(!rerender);
    }

    const fetchEvents = async (eventColRef) => {
        const events = await getDocs(eventColRef);
        const newEventsArr = [];
        events.forEach(doc => {
            const docObject = doc.data();
            const startDateYear = docObject.startDate.slice(0, 4);
            const startDateMonth = docObject.startDate.slice(5, 7) - 1;
            const startDateDay = docObject.startDate.slice(8, 10);
            const endDateYear = docObject.endDate.slice(0, 4);
            const endDateMonth = docObject.endDate.slice(5, 7) - 1;
            const endDateDay = parseInt(docObject.endDate.slice(8, 10)) + 1;

            const newObject = {
                title: docObject.title,
                start: new Date(startDateYear, startDateMonth, startDateDay),
                end: new Date(endDateYear, endDateMonth, endDateDay)
            }

            newEventsArr.push(newObject);
        })

        setEventsArr(newEventsArr);

    }

    useEffect(() => {
        setIsLoading(!isLoading);
        setTimeout(() => {
            onAuthStateChanged(auth, (user) => {
                if(user){
                    const eventColRef = collection(db, 'users', user.uid, 'events');
                    fetchEvents(eventColRef).then(() => {setIsLoading(false)}).catch((error) => console.log(error));
                }else{
                    navigate('/dashboard');
                }
            })
        }, 500);
        
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [rerender])

    const handleShowInfo = () => {
        setShowInfo(!showInfo);
    }

    const deleteEvent = async () => {
        const deleteDocRef = doc(db, 'users', auth.currentUser.uid, 'events', deleteTitle)
        await deleteDoc(deleteDocRef);
        setRerender(!rerender);
    }

    return(
        <div className='calendar-page'>
            <div className='projects-header'>
                <h1>Calendar</h1>
                <div className='info-circle' onMouseEnter={handleShowInfo} onMouseLeave={handleShowInfo}><FontAwesomeIcon icon={faQuestionCircle} /></div>
                {showInfo ? <CalendarInfo /> : <></>}
            </div>
            <div className='plus-circle' onClick={() => setShowAddEvent(!showAddEvent)}><FontAwesomeIcon icon={faPlusSquare} /><h4>Add a new event</h4></div>
            <div className='calendar-wrapper'>
                <Calendar localizer={localizer}
                    events={eventsArr}
                    startAccessor='start' 
                    endAccessor='end' 
                    style={{height: '70vh', width: '100%', marginTop: '24px'}} 
                    onDoubleClickEvent={deleteEvent}
                    onSelectEvent={e => setDeleteTitle(e.title)}
                />
            </div>
            {showAddEvent ? <EventAdd setRerender={setRerender} rerender={rerender} closeEvent={closeEvent}/> : <></>}
            {isLoading ? <Loading/> : <></>}
        </div>
    )
}