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


async function getConstraints() {
  const res = await fetch('http://localhost:8000/api/constraints')
  const data = await res.json();
  console.log(data.rows)
  let cstrObj = {}
  for(let i = 0; i < data.rows.length; i++) {
    if(!cstrObj[data.rows[i][0]]) {cstrObj[data.rows[i][0]] = {}};
    if(!cstrObj[data.rows[i][0]]['fk']) {cstrObj[data.rows[i][0]]['fk'] = {}};

    if (data.rows[i][0] === data.rows[i][2]) {
      cstrObj[data.rows[i][0]]['pk'] = data.rows[i][1];
    }
    else {
      
      cstrObj[data.rows[i][0]]['fk'][data.rows[i][1]] = [data.rows[i][2], data.rows[i][3]];
    }
  }
  return cstrObj;
}
const constraints = await getConstraints();
console.log('Constraints', constraints);

async function getFullData() {  
   const res = await fetch('http://localhost:8000/api/tables')
   const data = await res.json();
   return data.rows;
}
const data =  await getFullData();
console.log('Data', JSON.stringify(data))

// setTimeout(() => {},3000)
/*
fetch('http://localhost:8000/api/tables')
.then ()
*/

  
const fullData = [];
async function fullDataArray (data) {

  //[[o1][o2][o3]]
  for (let i = 0; i < data.length; i++) {
    const res = await fetch(`http://localhost:8000/api/columns/${data[i]}`)
    const rowData = await res.json();
    const newArray = [data[i]];
    for(let j = 0; j < rowData.rows.length; j++) {

      const dataObj = {};
      dataObj.name = rowData.rows[j][0];
      dataObj.type = rowData.rows[j][1];
     // const pk = (constraints[data[i]].pk === dataObj.name)? "True":"False";
      dataObj.pk = (constraints[data[i]].pk === dataObj.name)? "True":"False";
     // const fk = (constraints[data[i]].fk.includes(dataObj.name)? "True":"False";
      dataObj.fk = (constraints[data[i]]['fk'][(dataObj.name)]? "True":"False");
      dataObj.constraint = 'None'
      newArray.push(dataObj);
      }
      fullData.push(newArray);
  }

  return fullData;

  }


const rfData = await fullDataArray(data);
//  const rfData = setTimeout(await fullDataArray(data), 0);

const nodePositions = [
  { x: 0, y: 0 },
  { x: 500, y: 0 },
  { x: 0, y: 350 },
  { x: 500, y: 350 },
  { x: 0, y: 700 },
  { x: 500, y: 700 },
  { x: 0, y: 1050 },
  { x: 500, y: 1050 },
  { x: 0, y: 1400 },
  { x: 500, y: 1400 },
  { x: 0, y: 1750 },
  { x: 500, y: 1750 },
  { x: 0, y: 2100 },
  { x: 500, y: 2100 },
  { x: 0, y: 2450 },
  { x: 500, y: 2450 },
  { x: 0, y: 2450 },
];

const initialNodes = [];
for (let i = 0; i < rfData.length; i++) {
  console.log('IN FOR LOOP')
  initialNodes.push({
    id: `${i}`,
    position: nodePositions[i],
    data: { table: fullData[i] },
    type: 'table',
  });
}
console.log('INITIAL NODES', initialNodes)
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
    <div style={{ height: '80vh', width: '85vw' }}>
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

  
