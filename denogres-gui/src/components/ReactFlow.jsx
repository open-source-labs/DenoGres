import { useState, useEffect, useCallback } from 'react';
import { Link, useParams } from 'react-router-dom';
import ReactFlow, {
  Controls,
  Background,
  applyNodeChanges,
  applyEdgeChanges,
  Position,
} from 'reactflow';
import 'reactflow/dist/style.css';
import TableNode from './TableNode.jsx';

const nodeTypes = {
  table: TableNode,
};
// name='string'
// type='string'
// constraint='None'
// fk= 'False'
// pk= 'False'

async function getFullData() {
  const res = await fetch('http://localhost:8000/api/tables');
  const data = await res.json();
  return data.rows;
}
const data = await getFullData();
console.log('Data', JSON.stringify(data));

// setTimeout(() => {},3000)
/*
fetch('http://localhost:8000/api/tables')
.then ()
*/

const fullData = [];
async function fullDataArray(data) {
  //[[o1][o2][o3]]
  for (let i = 0; i < data.length; i++) {
    const res = await fetch(`http://localhost:8000/api/columns/${data[i]}`);
    const rowData = await res.json();
    const newArray = [data[i]];
    for (let j = 0; j < rowData.rows.length; j++) {
      const dataObj = {};
      dataObj.name = rowData.rows[j][0];
      dataObj.type = rowData.rows[j][1];
      dataObj.pk = 'False';
      dataObj.fk = 'False';
      dataObj.constraint = 'None';
      newArray.push(dataObj);
    }
    fullData.push(newArray);
  }

  return fullData;

  /* 
  await data.map((e) => {
    return fetch(`http://localhost:8000/api/columns/${e}`)
    .then(response => response.json())
    .then(rowInfo => {
      const newArray = [e];
      for(let j = 0; j < rowInfo.rows.length; j++) {
           
          const dataObj = {};
          dataObj.name = rowInfo.rows[j][0];
          dataObj.type = rowInfo.rows[j][1];
          dataObj.pk = 'False'
          dataObj.fk = 'False'
          dataObj.constraint = 'None'
          newArray.push(dataObj);
          }
          fullData.push(newArray);
      })
    })
      return fullData;

*/
}

const rfData = await fullDataArray(data);
//  const rfData = setTimeout(await fullDataArray(data), 0);

const initialNodes = [];
for (let i = 0; i < rfData.length; i++) {
  console.log('IN FOR LOOP');
  initialNodes.push({
    id: `${i}`,
    position: { x: `${500 * i}`, y: `0` },
    data: { table: fullData[i] },
    type: 'table',
  });
}
console.log('INITIAL NODES', initialNodes);
const initialEdges = [
  { id: '1-2', source: '1', target: '2', label: 'to the', type: 'step' },
];

function Flow() {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);

  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );
  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  return (
    <div
      className="react-flow-div"
      // style={{ height: '80vh', width: '85vw' }}
    >
      <ReactFlow
        nodes={nodes}
        onNodesChange={onNodesChange}
        edges={edges}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}

export default Flow;
