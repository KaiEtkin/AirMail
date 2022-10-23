import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import SignIn from './pages/SignIn'
import CreateFamily from './pages/CreateFamily'
import { useState, useEffect } from 'react';
import HashLoader from "react-spinners/HashLoader";
import NewPost from './pages/NewPost';
import JoinOrCreate from './pages/JoinOrCreate';
import Feed from './pages/Feed';
import './App.css'
import logo from './pages/logo.png'

function App() {
  

  const [isAuth, setIsAuth] = useState(false);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
    }, 2000)
  }, [])
  return (
    <div className='App'>
      {
        loading ?

        <HashLoader
        className='LoadingScreen'
        color={'#00CCFF'}
        loading={loading}
        
        size={150}
        aria-label="Loading Spinner"
        data-testid="loader"
      />

        :
        <>
        <nav><img src = {logo} width = '100'/></nav>
        <Router>
      
      <Routes>
        <Route path='/' element={<SignIn setIsAuth={setIsAuth} />} />
        <Route path='/createfamily' element={<CreateFamily />} />
        <Route path='/joinorcreate' element={<JoinOrCreate />} />
        <Route path='/feed' element={<Feed />} />
        <Route path='/newpost' element={<NewPost />} />
      </Routes>
      </Router>
      </>
      }
      
    
    </div>
    
  );
}

export default App;
