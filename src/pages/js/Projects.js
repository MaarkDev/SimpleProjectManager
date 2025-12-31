import { useState, useEffect } from 'react';
import { faPlusSquare, faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { db, auth } from '../../needed/Firebase';
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import ExpandedProject from '../../components/js/ExpandedProject';
import GraphReplacement from '../../components/js/GraphReplacement';
import NoProjectCard from '../../components/js/NoProjectCard';
import ProjectCard from '../../components/js/ProjectCard';
import ProjectAdd from '../../components/js/ProjectAdd';
import Loading from '../../components/js/Loading';
import ProjectsInfo from '../../components/js/ProjectsInfo';
import '../css/projects.css';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function Projects() {
    const [showAdd, setShowadd] = useState(false);
    const [showExpanded, setShowExpanded] = useState(false);
    const [arrayOfProjects, setArrayOfProjects] = useState([]);
    const [deleteTitle, setDeleteTitle] = useState('');
    const [objToOpen, setObjToOpen] = useState({})
    const [rerenderProjects, setRerenderProjects] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [closeEvent, setCloseEvent] = useState(false);
    const [showInfo, setShowInfo] = useState(false);
    const navigate = useNavigate() 

    function handleAddClick() {
        setShowadd(!showAdd)
    }

    const fetchProjects = async (projColRef) => {
        const getData = await getDocs(projColRef);
        const fetchedProjects = getData.docs
            .map(doc => doc.data())
            .filter(project => project.title !== "init");
        setArrayOfProjects(fetchedProjects.filter(obj => obj.title !== deleteTitle));
    }

    const deleteHandeler = async (title) => {
        setDeleteTitle(title);           
        await deleteDoc(doc(db, 'users', auth.currentUser.uid, 'projects', title)); 
        await fetchProjects();
    }

    useEffect(() => {
        setIsLoading(!isLoading);
        setTimeout(() => {
            onAuthStateChanged(auth, (user) => {
                if(user){
                    const projColRef = collection(db, 'users', user.uid, 'projects');
                    fetchProjects(projColRef).then(() => {setIsLoading(false)}).catch((error) => console.log(error));
                }else{
                    navigate('/dashboard');
                }
            })
        }, 500);
        
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [deleteTitle, closeEvent, rerenderProjects])


    const openHandler = (cardTitle) => {
        const currentObj = arrayOfProjects.filter(obj => obj.title === cardTitle);
        setObjToOpen(currentObj);
        setShowExpanded(!showExpanded);
    }

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

    const handleShowInfo = () => {
        setShowInfo(!showInfo);
    }

    return (
        <div className='project-page'>
            <div className='projects-header'>
                <h1>Your Projects</h1>
                <div className='info-circle' onMouseEnter={handleShowInfo} onMouseLeave={handleShowInfo}><FontAwesomeIcon icon={faQuestionCircle} /></div>
                {showInfo ? <ProjectsInfo /> : <></>}
            </div>

            <div className='plus-circle' onClick={handleAddClick} ><FontAwesomeIcon icon={faPlusSquare} /><h4>Add a new project</h4></div>

            <div className='projects-main'>
                <div className='projects-container'>
                    <h3>In progress...</h3>

                    {
                        arrayOfProjects.length !== 0 ? arrayOfProjects.filter(project => project.state !== 'complete').map(project => (
                            <ProjectCard
                                key={project.id}
                                title={project.title}
                                desc={project.desc}
                                priority={project.priority}
                                setDeleteTitle={setDeleteTitle}
                                deleteHandeler={deleteHandeler}
                                showExpanded={showExpanded}
                                openHandler={openHandler}
                                deadline={project.deadline}
                                dateCreated={project.dateCreated}
                            />
                        )) : <NoProjectCard title="No projects yet..." desc="Click 'Add a new project' to create a new project."/>
                    }

                </div>
                <div className='projects-completed-container'>
                    <h3>Completed</h3>

                    {
                        arrayOfProjects.length !== 0 ? arrayOfProjects.filter(project => project.state === 'complete').map(project => (
                            <ProjectCard
                                key={project.id}
                                title={project.title}
                                desc={project.desc}
                                priority={project.priority}
                                setDeleteTitle={setDeleteTitle}
                                deleteHandeler={deleteHandeler}
                                showExpanded={showExpanded}
                                openHandler={openHandler}
                                deadline={project.deadline}
                                dateCreated={project.dateCreated}
                            />
                        )) : <></>
                    }
                </div>
                <div className='projects-analytics'>
                    <h3>Your projects analytics</h3>

                    {arrayOfProjects.length !== 0 ? <>
                        <div className='proj-graph'>
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
                                    }}/>  
                        </div>
                        <div className='proj-graph priority'>
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
                                    }}/>

                        </div>
                    </> : <div className='proj-graph nograph projects-no-graph'><GraphReplacement /></div>}

                </div>
            </div>
            {isLoading ? <Loading /> : <></>}
            {showAdd ? <ProjectAdd hide={handleAddClick} setCloseEvent={setCloseEvent} closeEvent={closeEvent} /> : <></>}
            {showExpanded ? <ExpandedProject closeEvent={closeEvent} setCloseEvent={setCloseEvent} showExpanded={showExpanded} setShowExpanded={setShowExpanded} objToOpen={objToOpen} rerenderProjects={rerenderProjects} setRerenderProjects={setRerenderProjects}/> : <></>}
        </div>
    )
}