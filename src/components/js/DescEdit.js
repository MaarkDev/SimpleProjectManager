import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckSquare } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../../needed/Firebase';
import '../css/descedit.css';


export default function DescEdit({ showEditDesc, descEditHandler, objToOpen }){
    const [newDesc, setNewDesc] = useState('');
    const descRef = doc(db, 'users', auth.currentUser.uid, 'projects', objToOpen[0].title);

    const handleUpdate = async () => {
        await updateDoc(descRef, {desc: newDesc});
        descEditHandler(!showEditDesc)
    }

    return(
        <div className="desc-edit-page">
            <div className="descedit-card" onClick={(event) => {event.stopPropagation();}}>
                <h2 className='descedit-title'>Description editor</h2>
                <textarea className='desc-input' placeholder='Enter a new description here' onChange={(e) => {
                    if(e.target.value.length < 2){
                        setNewDesc('init')
                    }else{
                        setNewDesc(e.target.value)
                    }
                }}/>
                <div className='task-add-btn'>
                    <FontAwesomeIcon icon={faCheckSquare} onClick={() => handleUpdate()}/>
                </div>
            </div>
        </div>
    )
}