import '../css/projectsinfo.css';

export default function TasksInfo(){
    return(
        <div className='info-wrapper'>
            <div className='info-text'>
                <h4>How to use this tab?</h4>
                <ul>
                    <li>These tasks have nothing to do with the tasks in "Your Projects"! You can use this tab as notes, reminders</li>
                    <li>Create a new task by clicking the "Add a new task button"</li>
                    <li>In the pop-up, enter the tasks title, description, click "Flag as important" to make an "Important" sign appear on the task in the tasks list</li>
                    <li>Click "Save" to add the new task</li>
                </ul>
            </div>

        </div>
    )
}