import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import '../styles/sidebar.css';

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
            <Link
              to={'/home'}
              className="navbuttons"
            >
              Home
            </Link>
          </li>
          <li key={1}>
            <Link
              to={'/connections'}
              className="navbuttons"
            >
              Connections
            </Link>
          </li>
          <li>
            <Link
              to={'/console'}
              className="navbuttons"
            >
              Console
            </Link>
          </li>
          <li>
            <Link
              to={'/migrations'}
              className="navbuttons"
            >
              Migrations
            </Link>
          </li>
          <li>
            <Link
              to={'/diagram'}
              className="navbuttons"
            >
              Diagram
            </Link>
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
