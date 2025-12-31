import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from '../../needed/Firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../needed/Firebase';
import GoogleButton from 'react-google-button';
import '../css/loginpage.css';

export default function LoginPage(){
    const navigate = useNavigate() 

    onAuthStateChanged(auth, async (user) => {
        if (user) {
            console.log("SIGNED IN");
            const userRef = doc(db, 'users', user.uid);
            const docSnap = await getDoc(userRef);

            if (docSnap.exists()) {
                //console.log("Document data:", docSnap.data());
            }
            else {
                await setDoc(doc(db, 'users', user.uid), {
                    name: user.displayName,
                    mail: user.email,
                })
                setDoc(doc(db, 'users', user.uid, 'projects', 'init'), {
                    title: 'init'
                })
                setDoc(doc(db, 'users', user.uid, 'tasks', 'init'), {
                    title: 'init'
                })
            }

            navigate("/dashboard");
        }
    });      

    const HandleLogIn = async () => {
        signInWithPopup(auth, provider)
    }

    return(
        <div className="login-page">
            <div className='login-left'>
            <img src={process.env.PUBLIC_URL + '/logo.png'} className='left-img' alt='logo' />
                <h1>Simple Project Manager</h1>
                <p>To keep your projects in one place!</p>
                <GoogleButton onClick={HandleLogIn} className='login-btn' type='dark'/>
            </div>
            
        </div>
    )
}