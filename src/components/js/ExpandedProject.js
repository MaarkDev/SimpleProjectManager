import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquareXmark, faPlusSquare, faCheckToSlot, faEdit } from '@fortawesome/free-solid-svg-icons';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { useState } from 'react';
import { collection, doc, getDocs, getDoc, updateDoc } from 'firebase/firestore';
import { db, auth } from '../../needed/Firebase';
import { useEffect } from 'react';
import GraphReplacement from '../js/GraphReplacement.js';
import NoTasksCard from '../js/NoTasksCard';
import DescEdit from '../js/DescEdit.js';
import TaskAdd from '../js/TaskAdd';
import TaskCard from '../js/TaskCard';
import '../css/expandedproject.css';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function ExpandedProject({ showExpanded, setShowExpanded, objToOpen, setRerenderProjects, rerenderProjects, closeEvent, setCloseEvent }) {
    const [showAddTask, setShowAddTask] = useState(false);
    const [showEditDesc, setshowEditDesc] = useState(false);
    const [arrayOfTasks, setArrayOfTasks] = useState([]);
    const [deleteTitle, setDeleteTitle] = useState('');
    const [rerender, setRerender] = useState(false);
    const [desc, setDesc] = useState('');
    const [state, setState] = useState('')
    const taskColRef = collection(db, 'users', auth.currentUser.uid, 'projects', objToOpen[0].title, 'tasks');

    const newTaskHandler = () => {
        setShowAddTask(!showAddTask);
    }

    const fetchTasks = async () => {
        const getData = await getDocs(taskColRef);
        const fetchedProjects = getData.docs
            .map(doc => doc.data())
            .filter(doc => doc.init !== "init");
        setArrayOfTasks(fetchedProjects.filter(obj => obj.title !== deleteTitle));
        console.log(arrayOfTasks)
    }

    const fetchDesc = async () => {
        const descRef = doc(db, 'users', auth.currentUser.uid, 'projects', objToOpen[0].title);
        const descToRender = await getDoc(descRef);
        setDesc(descToRender.data().desc);
        console.log("Desc to render: ", descToRender.data().desc);
    }

    const fetchState = async () => {
        const descRef = doc(db, 'users', auth.currentUser.uid, 'projects', objToOpen[0].title);
        const descToRender = await getDoc(descRef);
        setState(descToRender.data().state);
        console.log("Desc to render: ", descToRender.data().state);
    }

    useEffect(() => {
        console.log("fetching tasks");
        fetchTasks();
        fetchDesc();
        fetchState();
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [showAddTask, deleteTitle, rerender, showEditDesc])

    const listToRenderIncomplete = arrayOfTasks.filter(task => task.state === 'incomplete').map(task => (
        <TaskCard
            key={task.title}
            title={task.title}
            projectName={objToOpen[0].title}
            setDeleteTitle={setDeleteTitle}
            deleteTitle={deleteTitle}
            setRerender={setRerender}
            rerender={rerender}
        />
    ));
    
    const listToRenderComplete = arrayOfTasks.filter(task => task.state === 'complete').map(task => (
        <TaskCard
            key={task.title}
            title={task.title}
            projectName={objToOpen[0].title}
            setDeleteTitle={setDeleteTitle}
            deleteTitle={deleteTitle}
            setRerender={setRerender}
            rerender={rerender}
        />
    ));

    const doughnutData = {
        labels: ['Tasks Done', 'Tasks in progress'],
        datasets: [
            {
                data: [listToRenderComplete.length, listToRenderIncomplete.length],
                backgroundColor: [
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

    const descEditHandler = (showEditDesc) => {
        setshowEditDesc(showEditDesc);
    }

    const projectStateHandler = async () => {
        const docRef = doc(db, 'users', auth.currentUser.uid, 'projects', objToOpen[0].title);
        if(state === 'complete'){
            await updateDoc(docRef, {state: 'incomplete'});
            setRerenderProjects(!rerenderProjects);
            setRerender(!rerender);
        }else{
            await updateDoc(docRef, {state: 'complete'});
            setRerenderProjects(!rerenderProjects);
            setRerender(!rerender);
        }
    }

    

    return (
        <div className='expanded-page' onClick={() => {setShowExpanded(!showExpanded); setCloseEvent(!closeEvent)}}>
            <div className='expanded-card' onClick={(event) => {event.stopPropagation()}}>
                <div className='expanded-title'>
                    <h1>{objToOpen[0].title.length > 10 ? objToOpen[0].title.slice(0, 10) + '...' : objToOpen[0].title}</h1>
                </div>
                <div className='proj-done' onClick={() => projectStateHandler()}>
                    <FontAwesomeIcon icon={faCheckToSlot} />
                    <p>{state === 'complete' ? 'Mark project as incomplete' : 'Mark project as done'}</p>
                </div>
                <div className='edit-desc' onClick={() => setshowEditDesc(!showEditDesc)}>
                    <FontAwesomeIcon icon={faEdit} className='expanded-desc-edit-icon'/>
                    <p className='extended-desc-edit'>Edit description</p>
                </div>
                <FontAwesomeIcon icon={faSquareXmark} className='expanded-close' onClick={() => {setShowExpanded(!showExpanded); setCloseEvent(!closeEvent)}} />
                <div className='expanded-main'>
                    <div className='expanded-left'>
                        <div className='expanded-desc'>
                            <p>{desc}</p>
                        </div>
                        <div className='graph'>
                            {arrayOfTasks.length !== 0 ?  <Doughnut data={doughnutData}
                                width={300}
                                options={{
                                    maintainAspectRatio: true,
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
                                }}
                            /> : 
                            <GraphReplacement />
                            }
                        </div>

                    </div>
                    <div className='expanded-task-section'>
                        <div className='expanded-task-title'>
                            <h2>Tasks</h2>
                            <div className='expanded-icons' onClick={() => newTaskHandler()}>
                                <FontAwesomeIcon icon={faPlusSquare} /><p>Add a new task</p>
                            </div>
                            <div className='expanded-dates'>
                                <p>Deadline: {objToOpen[0].deadline}</p>
                                <p>Created: {objToOpen[0].dateCreated}</p>
                            </div>
                            <div className='expanded-tasks-list'>
                                {arrayOfTasks.length !== 0 ? 
                                    <>
                                        <h3 className='task-sec-title'>Working on...</h3>
                                        {listToRenderIncomplete}
                                        <h3 className='task-sec-title c'>Completed</h3>
                                        {listToRenderComplete}
                                    </>
                                : <NoTasksCard />}
                            </div>

                        </div>
                    </div>
                </div>
            </div>
            {showAddTask ? <TaskAdd close={newTaskHandler} state={showAddTask} objToOpen={objToOpen} /> : <></>}
            {showEditDesc ? <DescEdit showEditDesc={showEditDesc} descEditHandler={descEditHandler} objToOpen={objToOpen}/> : <></>}
        </div>
    )
}