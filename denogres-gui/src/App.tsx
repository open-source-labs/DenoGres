import React from 'react';
import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
} from 'react-router-dom';

import ReactFlow from './components/ReactFlow.jsx';

export default function App(props) {
  return (
    <Router>
      <Routes>
        <Route
          exact
          path="/"
          element={<ReactFlow />}
        />
        <Route
          path="*"
          element={<Navigate to="/" />}
        />
      </Routes>
    </Router>
  );
}
