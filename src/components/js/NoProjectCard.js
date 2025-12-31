import { useState } from 'react';
import '../css/projectcard.css';


export default function ProjectCard({ title, desc, priority, openHandler }){
    const [isHover, setIsHover] = useState(false);

    const checkTitle = (title) => {
        if(title.length > 20){
            return title.slice(0,20) + '...';
        }else{
            return title;
        }
    }
    const newTitle = checkTitle(title);

    const checkDesc = (title) => {
        if(desc.length > 160){
            return desc.slice(0,160) + '...';
        }else{
            return desc;
        }
    }
    const newDesc = checkDesc(desc)

    const handleMouseEnter = () => {
        setIsHover(true);
    }

    const handleMouseLeave = () => {
        setIsHover(false);
    }

    const priorityStyleHoverCard = () => {
        if (priority === 'low' && isHover) {
          return 'rgb(211, 211, 255)'
        }
        if (priority === 'med' && isHover) {
          return 'rgb(191, 255, 191)'
        }
        if (priority === 'high' && isHover) {
          return 'rgb(255, 191, 191)'
        }
        // Add a default return value in case none of the conditions are met
        return '';
      };

      const priorityStyleHoverBar = () => {
        if (priority === 'low') {
          return 'rgb(124, 124, 255)'
        }
        if (priority === 'med') {
          return 'rgb(104, 255, 104)'
        }
        if (priority === 'high') {
          return 'rgb(255, 104, 104)'
        }
        // Add a default return value in case none of the conditions are met
        return '';
      };
      

    return(
        <div className='project-card' onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} style={{backgroundColor: priorityStyleHoverCard()}}>
            <div className='project-start' style={{backgroundColor: priorityStyleHoverBar()}}>

            </div>
            <div className='card-info' onClick={() => openHandler(title)}>
                <div className='card-title'>
                    <h2>{newTitle}</h2>
                </div>
                <div className='card-desc'>
                    <p>{newDesc}</p>
                </div>
            </div>
            <div className='card-open'>
                
            </div>
        </div>
    )
}