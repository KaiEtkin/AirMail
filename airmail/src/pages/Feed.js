
import { auth, db, storage } from '../firebase'
import { doc,getDoc,setDoc, getDocs, collection, addDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth'
import { useAuthState } from 'react-firebase-hooks/auth'
import { useState,useEffect } from 'react'
import "../GlobalStyles.css";
const Feed = () => {
    const [posts, setPosts] = useState([]);
    const [random, setRandom] = useState(0);
    const code = localStorage.getItem('family');
    useEffect(() => {
        init();
      }, []);
    async function init(){
        const ref = collection(db, "families", code, "images");
        const snap = await getDocs(ref);
        let temp = [];
  
        snap.forEach((doc) => {
            temp.push({title: doc.get('title'), url: doc.get('url'), desc: doc.get('desc'), type: doc.get('type'), date: doc.get('date'), people: doc.get('people')})
        })
        setPosts(temp);
        console.log(temp);
    }
    const updateRandom = () => {
        setRandom(Math.floor(Math.random() * posts.length));
    }
  return (
    <div onClick = {updateRandom} className = 'contain'> 
    {posts.length > 0 && 
    <>
    <div className = "feedDeets">
    <br />
        <br />
        <h1 style = {{fontSize: '50px'}}>{posts[random].title}</h1>  
        <h2>{posts[random].date}</h2>  
        <h3>{posts[random].desc}</h3>  
        <h2>People in this: </h2>
        {posts[random].people.map((ppl, index) => (
      <h1>{ppl}</h1>
        ))}
        <button onClick = {() => localStorage.removeItem('family')}>clear for dev dont keep</button>
        </div>
        <div className = "content">
        {posts[random].type == 'photo' && <img src = {posts[random].url} width='100%'/>}  
        {posts[random].type == 'video' && <video width="100%" controls>
        <source src={posts[random].url} type="video/mp4">
        </source>
        </video>}  
        
        </div>
        </>
    }
    
    
    </div>
  )
}

export default Feed