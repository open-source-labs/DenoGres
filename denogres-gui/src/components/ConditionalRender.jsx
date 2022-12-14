import React, { useState, useEffect } from 'react';

function ConditionalRender() {
  const [connection, setConnection] = useState(false);
  const [ReactFlow, setReactFlow] = useState(null);

  const validate = async () => {
    const checkCookie = await fetch('http://localhost:8000/cookieId', {
      credentials: 'include',
    });
    const response = await checkCookie.json();
    setConnection(response.hasConnection);
  };

  const loadReactFlow = async () => {
    const flowModule = await import('./ReactFlow.jsx');
    setReactFlow(flowModule.default);
  };

  useEffect(() => {
    validate();
    if (connection) {
      loadReactFlow();
    }
  }, [connection]);

  if (connection === false) {
    return <div>Hello, currently no database has been connected</div>;
  }

  if (connection && !ReactFlow) {
    return <div>Loading...</div>;
  }

  return <ReactFlow />;
}

export default ConditionalRender;
