import { useState, useEffect, useCallback } from 'react';
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
  useEffect(() => {
    validate();
  }, []);
  console.log('CONNECTION', connection);
  if (connection === false) {
    return <div>Hello, currently no database has been connected</div>;
  } else if (connection === true) {
    return <ReactFlow />;
  }
}

export default ConditionalRender;
