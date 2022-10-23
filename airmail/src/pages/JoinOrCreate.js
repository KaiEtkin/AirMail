import React from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth, db } from '../firebase'
import { doc,getDoc,setDoc, collection, addDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import {useNavigate} from 'react-router-dom';
import { signOut } from 'firebase/auth'
import { useState } from 'react';

function JoinOrCreate() {

  let navigate = useNavigate();

    const [user] = useAuthState(auth);
    const [familyCode, setFamilyCode] = useState('');
    
    async function joinFamily(){
        const docRef = doc(db, "families", familyCode);
        const docSnap = await getDoc(docRef);

        if(docSnap.exists()) {
            const ref = doc(db, "users", user.uid);
            await setDoc(ref, {
                name: user.displayName,
                photo: user.photoURL,
                family: familyCode
            });
        }

            const reff = doc(db, "families", familyCode);
            const docSnapp = await getDoc(reff);
            if(docSnapp.get('people') != null) {
              let people = docSnapp.get('people')
              
                people.push({
                    uid: user.uid,
                    name: user.displayName,
                    photo: user.photoURL
                });
                await updateDoc(reff, {
                  people: people
                });
              
            }
            
            else{
              await updateDoc(reff, {
                people: [{
                    uid: user.uid,
                    name: user.displayName,
                    photo: user.photoURL

                }]
              });
            }
            console.log("nav")
            navigate('/newpost')

            //ROUTE TO NEW POST PAGE!!
            return true;

          }
    

    const handleFamilyCode = (e) => {
        setFamilyCode(e.target.value)
    }

  return (
    <div className="joinOrCreate">
        <input onChange={handleFamilyCode} value={familyCode} placeholder="Family join code..."></input>
        <button onClick={joinFamily}>Join</button>
        <h1>OR</h1>
        <Link className="createFam" to='/createfamily'><button>Create Family</button></Link>

    </div>
  )
}

export default JoinOrCreate