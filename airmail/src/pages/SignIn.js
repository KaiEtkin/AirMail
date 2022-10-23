import {useState} from 'react';
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth,db, provider } from '../firebase';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { doc,getDoc,setDoc, collection, addDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { signInWithPopup, signInWithRedirect, signOut, onAuthStateChanged } from 'firebase/auth';
import {useNavigate} from 'react-router-dom';
import "../GlobalStyles.css";
import logo from './logo.png'


function SignIn({ setIsAuth }) {
    const [user] = useAuthState(auth);
    const [seniorCode, setSeniorCode] = useState('');
    let navigate = useNavigate();
   
    if(user != null){
      let check = checkExist();
      if(!check){
        navigate('joinorcreate')
      }
      else{
      navigate('/newpost')
      }
    }
    async function checkExist(){
      const ref = doc(db,'users', user.uid);
      const docSnap = await getDoc(ref);
      console.log(docSnap.exists())
      if(!docSnap.exists()){
        navigate('joinorcreate')
      }
      else{
      navigate('/newpost')
      }
    }
    if(localStorage.getItem('family') != null){
      navigate('/feed')
    }
    const signInWithGoogle = () => {
        signInWithRedirect(auth, provider).then((result) => {
            localStorage.setItem('isAuth', true);
            setIsAuth(true);
            lightBar();
        });
    }
    async function lightBar(){
      const docRef = doc(db, "users", user.uid);
            const docSnap = await getDoc(docRef);
            if(docSnap.get('family') != null){
              navigate('/newpost')
            }
            else{
              navigate('/joinorcreate')
            }
    }
    const handleSeniorCode = (e) => {
      setSeniorCode(e.target.value)
    }
    async function joinSenior(){
      const docRef = doc(db, "families", seniorCode);
      const docSnap = await getDoc(docRef);

      if(docSnap.exists()) {
        localStorage.setItem('family', seniorCode);
        navigate('/feed')

      }
      else{
        alert('not a family')
      }
    }
  return (
    <div className="SignIn">
    
      
        <h1>Senior:</h1>
        <input className="familyCode"value = {seniorCode} onChange={handleSeniorCode} placeholder='Code...'></input>
        <button className="JoinButton" onClick = {joinSenior}>Join</button>
        <h1>Not a Senior:</h1>
        
        <button onClick={signInWithGoogle}>Login With Google</button>
        
        {/*<Link to='/createfamily'><button>Done</button></Link>*/}
    </div>
  )
}

export default SignIn