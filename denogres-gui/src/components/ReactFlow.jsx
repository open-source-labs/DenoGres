import { useState, useEffect, useCallback } from 'react';
import { SmartBezierEdge } from '@tisoap/react-flow-smart-edge';
import ReactFlow, {
  Controls,
  Background,
  applyNodeChanges,
  applyEdgeChanges,
  MarkerType,
} from 'reactflow';
import 'reactflow/dist/style.css';
import TableNode from './TableNode.jsx';
import DownloadButton from './Download.tsx';

function iterateColors(colors) {
  let index = 0;

  function nextColor() {
    const color = colors[index];
    index = (index + 1) % colors.length;
    return color;
  }
  return nextColor;
}

const nextColor = iterateColors([
  'red',
  'orange',
  'green',
  'blue',
  'indigo',
  'violet',
  '#C21E56',
  '#551606',
  '#966F33',
]);

const nodeTypes = {
  table: TableNode,
};
const edgeTypes = {
  smart: SmartBezierEdge,
};

async function getConstraints() {
  const res = await fetch('http://localhost:8000/api/constraints');
  const data = await res.json();
  let cstrObj = {};
  for (let i = 0; i < data.rows.length; i++) {
    if (!cstrObj[data.rows[i][0]]) {
      cstrObj[data.rows[i][0]] = {};
    }
    if (!cstrObj[data.rows[i][0]]['fk']) {
      cstrObj[data.rows[i][0]]['fk'] = {};
    }
    if (data.rows[i][0] === data.rows[i][2]) {
      cstrObj[data.rows[i][0]]['pk'] = data.rows[i][1];
    } else {
      cstrObj[data.rows[i][0]]['fk'][data.rows[i][1]] = [
        data.rows[i][2],
        data.rows[i][3],
      ];
    }
  }
  return cstrObj;
}

const constraints = await getConstraints();

async function getFullData() {
  const res = await fetch('http://localhost:8000/api/tables');
  const data = await res.json();
  return data.rows;
}
const data = await getFullData();

const fullData = [];

async function fullDataArray(data) {
  for (let i = 0; i < data.length; i++) {
    const res = await fetch(`http://localhost:8000/api/columns/${data[i]}`);
    const rowData = await res.json();
    const newArray = [data[i]];
    for (let j = 0; j < rowData.rows.length; j++) {
      const dataObj = {};
      dataObj.name = rowData.rows[j][0];
      dataObj.type = rowData.rows[j][1];
      dataObj.pk = constraints[data[i]].pk === dataObj.name ? 'True' : 'False';
      dataObj.fk = constraints[data[i]]['fk'][dataObj.name] ? 'True' : 'False';
      dataObj.constraint = 'None';
      newArray.push(dataObj);
    }
    fullData.push(newArray);
  }

  return fullData;
}

const rfData = await fullDataArray(data);

const nodePositions = [];

const square = Math.ceil(Math.sqrt(rfData.length));
for (let i = 0; i < square; i++) {
  let ypos = 500 * i;
  for (let j = 0; j < square; j++) {
    let xpos = 600 * j;
    nodePositions.push({ x: xpos, y: ypos });
  }
}
const initialNodes = [];

for (let i = 0; i < rfData.length; i++) {
  initialNodes.push({
    id: `${fullData[i][0]}`,
    position: nodePositions[i],
    data: { table: fullData[i] },
    type: 'table',
  });
}

const initialEdges = [];
for (let key in constraints) {
  for (let fkKey in constraints[key].fk) {
    initialEdges.push({
      id: `${key}-${constraints[key].fk[fkKey][0]}`,
      source: `${key}`,
      sourceHandle: `${key}-${fkKey}-right`,
      target: `${constraints[key].fk[fkKey][0]}`,
      targetHandle: `${constraints[key].fk[fkKey][0]}-${constraints[key].fk[fkKey][1]}-left`,
      markerEnd: { type: MarkerType.ArrowClosed, color: 'black' },
      type: 'smart',
      style: { stroke: `${nextColor()}`, strokeWidth: 5 },
    });
  }
}

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
    <div className="react-flow-div">
      <DownloadButton
      />
      <ReactFlow
        nodes={nodes}
        onNodesChange={onNodesChange}
        edges={edges}
        edgeTypes={edgeTypes}
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
