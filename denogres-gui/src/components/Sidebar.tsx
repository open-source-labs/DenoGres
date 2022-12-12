import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import '../styles/sidebar.css';
import logo from '../assets/logo.png';
import cloud from '../assets/cloud-icon.svg';
import glass from '../assets/magnifier-icon.svg';
import databaseIcon from '../assets/database-icon.svg';
import logoutIcon from '../assets/logout-icon.svg';
import diagramIcon from '../assets/diagram-icon.svg';
// import sidebar paths and icons -> for now we just make a file with an array of objects
// import {sideBarMenu, socialIcons} from "../../data/data";
//import './sidebar.scss';
// import logo from './logo.png';

const Sidebar = () => {
  return (
    // Everything in a certain side
    <aside className="aside">
      <div className="aside-wrapper">
        <ul className="side-link">
          <li>
            <NavLink
              to={'/home'}
              data-hover="Home"
              className={({ isActive }) =>
                isActive ? 'navbuttons-active' : 'navbuttons'
              }
            >
              <span id="logo-span">
                <img
                  id="logo-img"
                  src={logo}
                />
              </span>
            </NavLink>
          </li>
          <li key={1}>
            <NavLink
              to={'/connections'}
              className={({ isActive }) =>
                isActive ? 'navbuttons-active' : 'navbuttons'
              }
            >
              <span id="logo-span">
                <img
                  id="logo-img"
                  src={databaseIcon}
                />
              </span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to={'/console'}
              className={({ isActive }) =>
                isActive ? 'navbuttons-active' : 'navbuttons'
              }
            >
              <span id="logo-span">
                <img
                  id="logo-img"
                  src={glass}
                />
              </span>
            </NavLink>
          </li>
          
          <li>
            <NavLink
              to={'/diagram'}
              className={({ isActive }) =>
                isActive ? 'navbuttons-active' : 'navbuttons'
              }
            >
              <span id="logo-span">
                <img
                  id="logo-img"
                  src={diagramIcon}
                />
              </span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to={'/logout'}
              className={({ isActive }) =>
                isActive ? 'navbuttons-active' : 'navbuttons'
              }
            >
              <span id="logo-span">
                <img
                  id="logo-img"
                  src={logoutIcon}
                />
              </span>
            </NavLink>
          </li>
        </ul>
      </div>
    </aside>
  );
};

// const Sidebar = () => {
//   return(
//       // Everything in a certain side
//       <aside className = 'aside'>
//       <div className= "aside-wrapper">
//           <Link to={"/"} className = "logo-section">
//              <img src={logo} alt="art"/>
//               <span className="switch__color">Rabea Ahmad</span>
//           </Link>
//           <ul className="side-link">{sideBarMenu.map((link, index) =>{
//               const {text, url, icon} = link;
//               return(
//                   <li key ={index}>
//                       <NavLink to={url} className ={({isActive}) => {
//                           return isActive ? "nav__links active-links" : "nav__links"
//                       }}>
//                           {icon}
//                           {text}
//                       </NavLink>
//                   </li>
//               )
//           })}
//               {}
//           </ul>
//           <div className="social-icon">
//               {socialIcons.map((icons, index) =>{
//                   const {icon, url} = icons;
//                   return(
//                      <a href={url} key={index} >
//                       {icon}
//                      </a>
//                   )
//               }
//           )}
//           </div>
//       </div>
//       </aside>
//   )
// }
export default Sidebar;
