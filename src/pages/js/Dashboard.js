import { db, auth } from "../../needed/Firebase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, getDocs, doc, deleteDoc, updateDoc } from "firebase/firestore";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQuestionCircle } from "@fortawesome/free-solid-svg-icons";
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDate';
import DashboardInfo from "../../components/js/DashboardInfo";
import GraphReplacement from "../../components/js/GraphReplacement";
import PersonalTask from '../../components/js/PersonalTask';
import NoPTaskCard from '../../components/js/NoPTaskCard';
import Loading from '../../components/js/Loading';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import '../css/dashboard.css';

ChartJS.register(ArcElement, Tooltip, Legend);

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

export default function Dashboard() {
    const [name, setName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [arrayOfProjects, setArrayOfProjects] = useState([]);
    const [arrayOfPTasks, setArrayOfPTasks] = useState([]);
    const [rerender, setRerender] = useState(false);
    const [eventsArr, setEventsArr] = useState([]);
    const [showInfo, setShowInfo] = useState(false);


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

    const fetchAndSortData = async () => {
        const eventColRef = collection(db, 'users', auth.currentUser.uid, 'events');
        await fetchEvents(eventColRef);
        setName(auth.currentUser.displayName.substring(0, auth.currentUser.displayName.indexOf(' ')));
        const projColRef = collection(db, 'users', auth.currentUser.uid, 'projects');
        const taskColRef = collection(db, 'users', auth.currentUser.uid, 'tasks');

        const dataProjects = await getDocs(projColRef);
        const dataTasks = await getDocs(taskColRef);

        const tempArr = [];
        const tempArrPTassk = [];

        dataProjects.forEach(doc =>  tempArr.push(doc.data()));
        dataTasks.forEach(doc =>  tempArrPTassk.push(doc.data()));

        setArrayOfProjects(tempArr.filter(doc => doc.title !== 'init'))
        setArrayOfPTasks(tempArrPTassk.filter(doc => doc.title !== 'init'))
    }

    useEffect(() => {
        setIsLoading(true);
        onAuthStateChanged(auth, (user) => {
            if (user) {
                fetchAndSortData().then(() => {setIsLoading(false)});

            }
        })
    //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [rerender])


    const doughnutData = {
        labels: ['Projects in progress', 'Projects Completed'],
        datasets: [
            {
                data: [arrayOfProjects.filter(proj => proj.state === 'incomplete').length, arrayOfProjects.filter(proj => proj.state === 'complete').length],
                backgroundColor: [
                    'red',
                    'limegreen'
                ],
                borderColor: [
                    'rgb(234, 234, 234)'
                ],
                borderWidth: 2,

            },
        ],
    };

    const doughnutDataPriority = {
        labels: ['Low Priority', 'Medium Priority', 'High Priority'],
        datasets: [
            {
                data: [arrayOfProjects.filter(proj => proj.priority === 'low').length, arrayOfProjects.filter(proj => proj.priority === 'med').length, arrayOfProjects.filter(proj => proj.priority === 'high').length],
                backgroundColor: [
                    'blue',
                    'limegreen',
                    'red'
                ],
                borderColor: [
                    'rgb(234, 234, 234)'
                ],
                borderWidth: 2,

            },
        ],
    };

    const pTaskDoughnutData = {
        labels: ['Incomplete tasks', 'Tasks completed'],
        datasets: [
            {
                data: [arrayOfPTasks.filter(task => task.state === 'incomplete').length, arrayOfPTasks.filter(task => task.state === 'complete').length],
                backgroundColor: [
                    'red',
                    'limegreen',
                ],
                borderColor: [
                    'rgb(234, 234, 234)'
                ],
                borderWidth: 2,

            },
        ],
    };

    const deletePTask = async (title) => {
        const taskToDeleteRef = doc(db, 'users', auth.currentUser.uid, 'tasks', title)
        await deleteDoc(taskToDeleteRef);
        setRerender(!rerender);
    }

    const taskDoneHandler = async (title, state) => {
        const taskDoneRef = doc(db, 'users', auth.currentUser.uid, 'tasks', title)
        if (state === 'incomplete') {
            await updateDoc(taskDoneRef, {
                state: 'complete'
            });
        } else {
            await updateDoc(taskDoneRef, {
                state: 'incomplete'
            });
        }
        setRerender(!rerender);
    }

    const handleShowInfo = () => {
        setShowInfo(!showInfo);
    }

    return (
        <div className="dashboard-page">
            <div className='projects-header'>
                <h1>Dashboard</h1>
                <div className='info-circle' onMouseEnter={handleShowInfo} onMouseLeave={handleShowInfo}><FontAwesomeIcon icon={faQuestionCircle} /></div>
                {showInfo ? <DashboardInfo /> : <></>}
            </div>
            <div className="dashboard-content-wrapper">
                <div className="dashboard-content-left">
                    <div className="dashboard-greeting">
                        <h2>Welcome back, {name}!</h2>
                    </div>
                    <div className="dashboard-data-wrapper">
                        
                        <div className="dashboard-tasks-stats-and-date">
                            <div className="dashboard-proj-stats">
                                <h2>Task analytics</h2>
                                {arrayOfPTasks.length !== 0 ? <>
                                    <div className='proj-graph dashboard-proj-stat-graph'>
                                        <Doughnut data={pTaskDoughnutData} options={{
                                            maintainAspectRatio: false,
                                            cutoutPercentage: 70,
                                            plugins: {
                                                legend: {
                                                    position: 'right',
                                                    labels: {
                                                        boxWidth: 15,
                                                        font: {
                                                            size: 15
                                                        },
                                                    }
                                                }
                                            }
                                        }} />
                                    </div>
                                </> : <div className='proj-graph nograph dashboard-no-graph'><GraphReplacement /></div>}


                                <h2 className="dashboard-cal-title">Calendar</h2>
                                <div className="dashboard-calendar-wrapper">
                                    <Calendar localizer={localizer}
                                        events={eventsArr}
                                        startAccessor='start'
                                        endAccessor='end'
                                        style={{ height: '360px', width: '360px', padding: '12px' }}
                                    />
                                </div>

                            </div>
                        </div>

                        <div className="dashboard-ptask-wrapper dashboard-proj-stats">
                            <h2>Your Tasks</h2>
                            <div className="dashboard-ptask-cards">
                                {arrayOfPTasks.length !== 0 ? arrayOfPTasks.filter(project => project.state !== 'complete').map(project => (
                                    <PersonalTask
                                        key={project.id}
                                        title={project.title}
                                        desc={project.desc}
                                        important={project.important}
                                        state={project.state}
                                        deleteHandler={deletePTask}
                                        taskDoneHandler={taskDoneHandler}
                                    />
                                )) : <NoPTaskCard />}
                                <h4 className="dashboard-ptask-h2">Completed</h4>
                            <div className="dashboard-ptask-cards">
                                {arrayOfPTasks.length !== 0 ? arrayOfPTasks.filter(project => project.state !== 'incomplete').map(project => (
                                    <PersonalTask
                                        key={project.id}
                                        title={project.title}
                                        desc={project.desc}
                                        important={project.important}
                                        state={project.state}
                                        deleteHandler={deletePTask}
                                        taskDoneHandler={taskDoneHandler}
                                    />
                                )) : <></>}
                            </div>
                            </div>
                            
                        </div>

                        <div className="dashboard-proj-stats">
                            <h2>Project analytics</h2>
                            {arrayOfProjects.length !== 0 ? <>
                                <div className='proj-graph dashboard-proj-stat-graph'>
                                    <Doughnut data={doughnutData} options={{
                                        maintainAspectRatio: false,
                                        cutoutPercentage: 70,
                                        plugins: {
                                            legend: {
                                                position: 'right',
                                                labels: {
                                                    boxWidth: 15,
                                                    font: {
                                                        size: 15
                                                    },
                                                }
                                            }
                                        }
                                    }} />
                                </div> </> : <div className='proj-graph nograph dashboard-no-graph'><GraphReplacement /></div>}

                                {arrayOfProjects.length !== 0 ? <>
                                <div className='proj-graph priority dashboard-proj-stat-graph'>
                                    <Doughnut data={doughnutDataPriority} options={{
                                        maintainAspectRatio: false,
                                        cutoutPercentage: 70,
                                        plugins: {
                                            legend: {
                                                position: 'right',

                                                labels: {
                                                    boxWidth: 15,
                                                    font: {
                                                        size: 15
                                                    },

                                                }
                                            }
                                        }
                                    }} />
                                </div> </> : <div className='proj-graph nograph dashboard-no-graph'><GraphReplacement /></div>}
                        </div>

                    </div>
                </div>
            </div>

            {isLoading ? <Loading /> : <></>}

        </div>
    )
}

