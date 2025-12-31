import '../css/projectsinfo.css';

export default function ProjectsInfo(){
    return(
        <div className='info-wrapper'>
            <div className='info-text'>
                <h4>How to use this tab?</h4>
                <ul>
                    <li>This page is for creating projects in which you can create tasks and check your progress</li>
                    <li>Create a project by clicking the "Add a new project button"</li>
                    <li>In the pop-up, enter the projects title, description, select a priority (depending on which one you select will the color of the project be in the list of projects), set a deadline</li>
                    <li>Click "Save" to add the new project</li>
                    <li>You can expand the project by clicking on it in the list of projects</li>
                    <li>In the expanded project pop up, you can add tasks, edit the description and see the progress on the doughnut chart</li>
                </ul>
            </div>

        </div>
    )
}