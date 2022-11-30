import { useState, useCallback } from 'react';
import { Link, useParams } from 'react-router-dom';
import ReactFlow, {
  Controls,
  Background,
  applyNodeChanges,
  applyEdgeChanges,
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
const tableData = [
  [
    'students',
    {
      name: 'firstName',
      type: 'string',
      constraint: 'None',
      pk: 'True',
      fk: 'False',
    },
    {
      name: 'lastName',
      type: 'string',
      constraint: 'None',
      pk: 'False',
      fk: 'False',
    },
    {
      name: 'major',
      type: 'string',
      constraint: 'None',
      pk: 'False',
      fk: 'False',
    },
  ],

  [
    'soda',
    {
      name: 'student',
      type: 'string',
      constraint: 'None',
      pk: 'False',
      fk: 'False',
    },
    {
      name: 'Soda',
      type: 'string',
      constraint: 'None',
      pk: 'False',
      fk: 'False',
    },
    {
      name: 'StudentID',
      type: 'integer',
      constraint: 'None',
      pk: 'True',
      fk: 'True',
    },
    {
      name: 'SodaID',
      type: 'integer',
      constraint: 'None',
      pk: 'True',
      fk: 'False',
    },
  ],
];
const initialNodes = [];
for (let i = 0; i < tableData.length; i++) {
  initialNodes.push({
    id: `${i}`,
    position: { x: `${400 * i}`, y: `0` },
    data: { table: tableData[i] },
    type: 'table',
  });
}
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
