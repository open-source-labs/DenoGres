import * as React from 'react';
import { useState, useEffect } from 'react';
import { Handle, Position } from 'reactflow';

export default function TableNode() {
  return (
    <div class="table-node">
      <div>
        <label htmlFor="text">
          {'starwars.people'}
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
              <td>NULL</td>
              <td>NULL</td>
              <td>NULL</td>
              <td>NULL</td>
              <td>NULL</td>
            </tr>
            {/* render row nodes depending on databse information */}
          </tbody>
        </table>
      </div>
    </div>
  );
}
