import '../css/projectsinfo.css';

export default function CalendarInfo(){
    return(
        <div className='info-wrapper'>
            <div className='info-text'>
                <h4>How to use this tab?</h4>
                <ul>
                    <li>This page is for planning future events and keeping track of them</li>
                    <li>Create a new event by clicking the "Add a new event button"</li>
                    <li>In the pop-up, enter the events title, start date and the end date</li>
                    <li>Make sure that the end date is not sooner than the start date or else your event wont be saved</li>
                    <li>Click "Save" to add the new event to your calendar</li>
                    <li>Double click the event to delete it</li>
                </ul>
            </div>

        </div>
    )
}