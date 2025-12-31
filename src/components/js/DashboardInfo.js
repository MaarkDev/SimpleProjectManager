import '../css/projectsinfo.css';

export default function DashboardInfo(){
    return(
        <div className='info-wrapper'>
            <div className='info-text'>
                <h4>How to use this tab?</h4>
                <ul>
                    <li>This is your dashboard, you can see your calendar, analytics and quick tasks on this page</li>
                    <li>Charts will only be shown when there is data to build the chart upon</li>
                    <li>Create a task/project in order to see a chart</li>
                    <li>The chart under "Task analytics" lets you visualise the ratio of complete/incomplete tasks</li>
                    <li>The chart under "Project analytics" lets you visualise the ratio of complete/incomplete projects</li>
                    <li>The 2nd chart under "Project analytics" lets you visualise the ratio of your projetcs priorities</li>
                </ul>
            </div>

        </div>
    )
}