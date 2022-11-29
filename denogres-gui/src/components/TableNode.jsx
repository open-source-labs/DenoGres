import * as React from 'react';
import { useState, useEffect } from 'react';
import { Handle, Position } from 'reactflow';
import RowNode from './RowNode'
export default function TableNode({ data }) {
  console.log('RFdata',data.table)
  return (
    <div class="table-node">
      <div>
        <label htmlFor="text">
          {data.table[0]}
          {/* //concat the databse name and collection */}
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
            {/* if row array is empty, create empty rows tof ill space */}
            <tr className="empty-row">
            <RowNode
                id={1}
                name={data.table[1].name}
                type={data.table[1].type}
                constraint={data.table[1].constraint}
                fk= {data.table[1].fk}
                pk= {data.table[1].pk}
              ></RowNode>
            </tr>
            <tr>
            <RowNode
                 id={2}
                 name={data.table[2].name}
                 type={data.table[2].type}
                 constraint={data.table[2].constraint}
                 fk= {data.table[2].fk}
                 pk= {data.table[2].pk}
              ></RowNode>
            </tr>
            <tr>
            <RowNode
                 id={3}
                 name={data.table[3].name}
                 type={data.table[3].type}
                 constraint={data.table[3].constraint}
                 fk= {data.table[3].fk}
                 pk= {data.table[3].pk}
              ></RowNode>
            </tr>
            {/* render row nodes depending on databse information */}
          </tbody>
        </table>
      </div>
    </div>
  );
}
