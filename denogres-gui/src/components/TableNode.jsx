import * as React from 'react';
import { useState, useEffect } from 'react';
import { Handle, Position } from 'reactflow';
import RowNode from './RowNode'
// /api/cplumns/<tablename>
// /api/tables
const handleStyle = {left:10};
export default function TableNode({ data }) {
//  console.log('DATA FROM TABLENODE', data)
  const rowArray = [];
  for (let i = 0; i < data.table.length -1; i++) {
    rowArray.push(<tr>
      <RowNode
      key={i}
      name={data.table[i+1].name}
      type={data.table[i+1].type}
      constraint={data.table[i+1].constraint}
      fk= {data.table[i+1].fk}
      pk= {data.table[i+1].pk}
      ></RowNode>
    </tr>)
  }
  
  return (
    <div className="table-node">
      
      <Handle type="target" position={Position.Left}/>
      
      <Handle type="source" position={Position.Right}/>
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
