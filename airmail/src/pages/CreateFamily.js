
import { auth, db } from '../firebase'
import {useAuthState} from 'react-firebase-hooks/auth'
import { doc,getDoc,setDoc, collection, addDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { useState } from 'react'
import {useNavigate} from 'react-router-dom';


function CreateFamily() {

  let navigate = useNavigate();

  const [name,setName] = useState('')
  const [user] = useAuthState(auth);
  function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * 
      charactersLength));
    }
    return result;
}
async function createFamily(){
  var newCode = makeid(3);
  alert('your share code is ' + newCode)
  const ref = doc(db,'families', newCode)
  await setDoc(ref, {
    name: name,
    code: newCode,
    
  });
  joinFam(newCode);
  navigate('/newpost')

}
async function joinFam(familyCode){
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
        return true;
}
const handleName = (e) => {
  setName(e.target.value)
}
  return (
    <>
    
    <h1>Create Family</h1>
    <input value = {name} onChange={handleName} type = "text" placeholder='Family Name...'></input>
    <button onClick = {createFamily}>Create Family</button>
    </>
  )
}

export default CreateFamily