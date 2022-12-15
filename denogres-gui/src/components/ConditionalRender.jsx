import React, { useState, useEffect } from 'react';
import ReactFlow from './ReactFlow.jsx';

function ConditionalRender() {
  const [connection, setConnection] = useState(false);

  const validate = async () => {
    const checkCookie = await fetch('http://localhost:8000/cookieId', {
      credentials: 'include',
    });
    const response = await checkCookie.json();
    setConnection(response.hasConnection);
  };

  validate();

  if (connection === false) {
    return (
      <div className="noDb">
        Uh-oh, currently no database is currently connected
      </div>
    );
  }

  if (connection && !ReactFlow) {
    return <div>Loading...</div>;
  }

  return <ReactFlow />;
}

export default ConditionalRender;
