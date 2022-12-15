import React, { useState, useEffect } from 'react';
import logoutIcon from '../assets/logout-icon.svg';
import { useNavigate } from "react-router-dom";


export default function LogOut() {
  const navigate = useNavigate();
  useEffect(() => {
    fetch('http://localhost:8000/jwt', {credentials: 'include'})
    .then(res => res.json())
    .then((data) => {
      if (data.success === false) {
        navigate('/')
      }
    })
  },[])
  const [count, setCount] = useState<number>(3);
  
  

  const navigateLogout = async () => {
    
    await fetch('http://localhost:8000/cookieRemove',{
      credentials: 'include',
    });
    navigate('/')
  }
  

  useEffect(() => {
    const logout = async () => {
      setTimeout(() => window.location.href = "/gui/", 3000);
      await fetch("/gui/api/handleRequests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ task: "clear user cache" }),
      });
      await fetch("/gui/api/logOut");
    };
    
    
  }, []);

  return (
    <div className="w-full flex flex-row">
      <div className="logoutGui">
        <div className="logoutHolder">
        <img src={logoutIcon}></img>
        </div>
        <div className='logoutText'>
          <p id='lm1'>Oh no! You're leaving...</p>
          <p id='lm2'>Are you sure?</p>
          <button 
            id='lm3'
            onClick={() => navigateLogout()}
          >
            Yes, Log Me Out
          
          </button>
        </div>
      </div>
      <div className="w-full bg-white rounded mx-3 p-3 items-center">
        
        
       
      </div>
    </div>
  );
}
