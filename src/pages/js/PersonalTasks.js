import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQuestionCircle, faPlusSquare } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { db, auth } from '../../needed/Firebase';
import { collection, getDocs, doc, deleteDoc, updateDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import NoPTaskCard from "../../components/js/NoPTaskCard";
import TasksInfo from "../../components/js/TasksInfo";
import PersonalTask from "../../components/js/PersonalTask";
import PTaskAdd from "../../components/js/PTaskAdd";
import Loading from "../../components/js/Loading";
import '../css/personaltasks.css';

export default function PersonalTasks(){
    const [showPTaskAdd, setShowPTaskAdd] = useState(false);
    const [arrayOfPTasks, setArrayOfPTasks] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [rerender, setRerender] = useState(false);
    const [deleteTitle, setDeleteTitle] = useState('');
    const [showInfo, setShowInfo] = useState(false);

    const navigate = useNavigate();

    const fetchPTasks = async (pTasksRef) => {
        const getData = await getDocs(pTasksRef);
        const fetchedTasks = getData.docs
            .map(doc => doc.data())
            .filter(project => project.title !== "init");
        setArrayOfPTasks(fetchedTasks.filter(obj => obj.title !== deleteTitle));
    }

    const deletePTask = async (title) => {
        setDeleteTitle(title);
        const taskToDeleteRef = doc(db, 'users', auth.currentUser.uid, 'tasks', title)
        await deleteDoc(taskToDeleteRef);
        setRerender(!rerender);
    }

    const taskDoneHandler = async (title, state) => {
        const taskDoneRef = doc(db, 'users', auth.currentUser.uid, 'tasks', title)
        if(state === 'incomplete'){
            await updateDoc(taskDoneRef, {
                state: 'complete'
            });
        }else{
            await updateDoc(taskDoneRef, {
                state: 'incomplete'
            });
        }
        setRerender(!rerender);
    }

    useEffect(() => {
        setIsLoading(!isLoading);
        setTimeout(() => {
            onAuthStateChanged(auth, (user) => {
                if(user){
                    const pTasksRef = collection(db, 'users', auth.currentUser.uid, 'tasks');
                    fetchPTasks(pTasksRef).then(() => {setIsLoading(false)}).catch((error) => console.log(error));
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

    return(
        <div className="personal-tasks-page">
            <div className='projects-header'>
                <h1>Your Tasks</h1>
                <div className='info-circle' onMouseEnter={handleShowInfo} onMouseLeave={handleShowInfo}><FontAwesomeIcon icon={faQuestionCircle} /></div>
                {showInfo ? <TasksInfo /> : <></>}
            </div>
            <div className='plus-circle' onClick={() => setShowPTaskAdd(!showPTaskAdd)}><FontAwesomeIcon icon={faPlusSquare} /><h4>Add a new task</h4></div>
            <div className='p-tasks-main'>
                <div className='to-do-p-tasks'>
                    <h3>To Do...</h3>
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
                    
                </div>
                <div className='done-p-tasks'>
                    <h3>Tasks Done</h3>
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
            {showPTaskAdd ? <PTaskAdd rerender={rerender} setRerender={setRerender} showPTaskAdd={showPTaskAdd} setShowPTaskAdd={setShowPTaskAdd}/> : <></>}
            {isLoading ? <Loading /> : <></>}
        </div>
    )
}