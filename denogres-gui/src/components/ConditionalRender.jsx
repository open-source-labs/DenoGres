// import { useState, useEffect } from 'react';

// function ConditionalRender() {
//   const [connection, setConnection] = useState(false);
//   const validate = async () => {
//     const checkCookie = await fetch('http://localhost:8000/cookieId', {
//       credentials: 'include',
//     });
//     const response = await checkCookie.json();
//     setConnection(response.hasConnection);
//   };

//   useEffect(() => {
//     validate();
//   }, []);

//   if (connection === false) {
//     return <div>Hello, currently no database has been connected</div>;
//   }

//   return <ReactFlow />;
// }
// export default ConditionalRender;

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

  useEffect(() => {
    validate();
  }, []);

  if (connection === false) {
    return <div>Hello, currently no database has been connected</div>;
  }

  if (connection && !ReactFlow) {
    import('./ReactFlow.jsx').then((flow) => {
      setReactFlow(flow.default);
    });
    return <div>Loading...</div>;
  }

  return <ReactFlow />;
}

export default ConditionalRender;

