import * as React from 'react';
import { useState, useEffect } from 'react';
import { Handle, Position } from 'reactflow';
import RowNode from './RowNode'
// /api/cplumns/<tablename>
// /api/tables

export default function TableNode({ data }) {
//  console.log('DATA FROM TABLENODE', data)
const handles = [];
const rowArray = [];
  for (let i = 0; i < data.table.length -1; i++) {
    rowArray.push(
    <tr>
      <RowNode
      key={i}
      name={data.table[i+1].name}
      type={data.table[i+1].type}
      constraint={data.table[i+1].constraint}
      fk= {data.table[i+1].fk}
      pk= {data.table[i+1].pk}
      ></RowNode>
    </tr>);
    handles.push(
      <><Handle
       type="target"
       position={Position.Left}
        style={{ top: 78 + 27 * i }}
        id={`${data.table[0][0]}-${data.table[i+1].name}-left`}
         />
      <Handle 
      type='source'
       position={Position.Right}
        style={{top: 78 + 27 * i}} 
        id={`${data.table[0][0]}-${data.table[i+1].name}-right`}
        /></>
    )

  }
  
  return (
    <div className="table-node">
      {handles}
      {/* <Handle type="target" position={Position.Left}/>
      
      <Handle type="source" position={Position.Right}/> */}
      <div>
        <label htmlFor="text">
          {data.table[0]}
        </label>
      </div>
      <div className="testMargin">
        <table>
          <thead>
            <tr className="columnBox">
              <th scope="col">Column</th>
              <th scope="col">Type</th>
              <th scope="col">Constraints</th>
              <th scope="col">Primary Key</th>
              <th
                scope="col"
                className="last-th"
              >
                Foreign Key
              </th>
            </tr>
          </thead>
          <tbody>
          {rowArray}
          </tbody>
        </table>
      </div>
    </div>
  );
}
