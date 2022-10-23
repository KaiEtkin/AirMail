import React from 'react'
import { auth, db, storage } from '../firebase'
import { doc,getDoc,setDoc, collection, addDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { signOut } from 'firebase/auth'
import { useAuthState } from 'react-firebase-hooks/auth'
import { useState,useEffect } from 'react'
import {useNavigate} from 'react-router-dom';
import "../GlobalStyles.css";

function NewPost() { //need to do the people drop down when thats synced into family and get family code from user to show that and push to right part of db
  const [user] = useAuthState(auth);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [month, setMonth] = useState('');
  const [day, setDay] = useState('');
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);
  const [myFam, setMyFam] = useState('');
  const [peePole, setPeePole] = useState([]);
  const [selected, setSelected] = useState([]);
  const [video, setVideo] = useState(false);
  const [photo, setPhoto] = useState(false);
  const [name, setName] = useState('');
  const types = ['image/png', 'image/jpeg', 'image/heic', 'video/mp4','video/quicktime'];
  let navigate = useNavigate();

  useEffect(() => {
    init();
  }, []);
  async function init(){
    const ref = doc(db,'users',user.uid);
    const boi = await getDoc(ref);
    setMyFam(boi.get('family'))
    console.log(boi.get('family'))
    const othaRef = doc(db,'families',boi.get('family'));
    const othaBoi = await getDoc(othaRef);
    setName(othaBoi.get('name'));
    console.log(othaBoi.get('people'))
    let temp = [];
    othaBoi.get('people').forEach((person) => {
      
      temp.push({name: person.name, uid: person.uid })
      
    });
    setPeePole(temp)
  }
  const changeHandler = (e) => {
    let selected = e.target.files[0];
    console.log(selected);
    if(selected && types.includes(selected.type)){
      setFile(selected);
      setError('');
      if(selected.type == 'video/mp4' || selected.type == 'video/quicktime')
      {
        setVideo(true);
        setPhoto(false);
      }
      else{
        setVideo(false);
        setPhoto(true);
      }
    } else {
      setFile(null);
      setError('Please select an image or video file')
    }
  }
  async function uploadStorage() {
    const storageRef = ref(storage, file.name);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on('state_changed', (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log('Upload is ' + progress + '% done');
    }, (error) => {
      console.log('failed')
    }, 
    () => {
      getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
      console.log('File available at', downloadURL);
      post(downloadURL)
    });
  }
  );  
  }
  async function post(url){
    var code = myFam
    const ref = doc(db,'families', code, 'images', file.name)
    let type = 'photo';
    if(video){
      type = 'video'
    }
    let date = month + "/" + day;
    await setDoc(ref, {
      title: title,
      desc: desc,
      url: url,
      type: type,
      date: date,
      people: selected
    });
  }

  const handleDesc = (e) => {
    setDesc(e.target.value);
  }
  const handleTitle = (e) => {
    setTitle(e.target.value);
  }
  const handleDay = (e) => {
    setDay(e.target.value);
  }
  const handleMonth = (e) => {
    setMonth(e.target.value);
  }
  const addSelected = (ind) => {
    if(!selected.includes(peePole[ind])){
      selected.push(peePole[ind].displayName)
    }
  }

  const signOutStuff = () => {
    navigate('/');
    signOut(auth);
  }
  return (
    <div className="newPost">
      <h1>Post to: {name}</h1>

      <h2>Picture/Video:</h2>

      <input type = "file" onChange={changeHandler} />
      
        { error && <h2>{error}</h2>}
        { photo && file && <img src = {URL.createObjectURL(file)} width="200" />}
        { video && file && <video width="320" height="240" controls>
  <source src={URL.createObjectURL(file)} type="video/mp4">
  </source>
</video>}

    <h2>Title:</h2>

    <input className='titleInput' type = 'text' value = {title} placeholder = 'Astonishing Title!' onChange={handleTitle}></input>

    <h2>Date:</h2>

    <div className='dateStuff'>
    <input className='timeInput' type = 'number' value = {month} placeholder = 'Crazy Month!' onChange={handleMonth}></input>
    <h1>/</h1>
    <input className='timeInput' type = 'number' value = {day} placeholder = 'Great Day!' onChange={handleDay}></input>
    </div>

    <h2>Description:</h2>
    <textarea  value = {desc} placeholder = 'Incredible Description!' onChange={handleDesc} cols="40" rows="5"></textarea>
    
    <h2>Who is in the photo/video?</h2>
    {peePole.map((pole, index) => (
      <h3 onClick = {() => addSelected(index)}>{pole.name}</h3>
    ))}

    {/*<button onClick = {signOutStuff} className = 'newpostbutt'>Sign Out</button>*/}
    <button onClick = {uploadStorage} className = 'newpostbutt'>Post</button>

    </div>
  
  )
}

export default NewPost