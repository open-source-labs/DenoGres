import React from 'react';
import { useState, useRef, useEffect } from 'react';



export default function TableNodeRow({ name, type, constraint, pk, fk }) {
  
  
  return (
    
       <>
        <td>{name}</td>
      <td>{type}</td>
        <td>{constraint}</td>
        <td>{pk}</td>
        <td>{fk}</td>
        </> 
    
  );
}