import React from 'react';
import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
} from 'react-router-dom';
import Login from './components/Login.tsx';
import Home from './components/Home.tsx';
import Connections from './components/Connections.tsx';
import Console from './components/Console.tsx';
import Migrations from './components/Migrations.tsx';
import ReactFlow from './components/ReactFlow.jsx';
import SidebarLayout from './components/SidebarLayout.tsx';

// export default function App(props) {
//   return (
//     <Router>
//       <Routes>
//         <Route
//           path="/sidebar"
//           element={<SidebarLayout />}
//         />
//         <Route
//           exact
//           path="/home"
//           element={<Home />}
//         />
//         <Route
//           path="/connections"
//           element={<Connections />}
//         />
//         <Route
//           path="/console"
//           element={<Console />}
//         />
//         <Route
//           path="/migrations"
//           element={<Migrations />}
//         />
//         <Route
//           exact
//           path="/diagram"
//           element={<ReactFlow />}
//         />
//         <Route
//           path="*"
//           element={<Error />}
//         />
//       </Routes>
//     </Router>
//   );
// }

export default function App(props) {
  return (
    <Router>
      <Routes>
        {/* <Route
          path="/"
          element={<Login />}
        /> */}
        <Route element={<SidebarLayout />}>
          <Route
            path="/home"
            element={<Home />}
          />
          <Route
            path="/connections"
            element={<Connections />}
          />
          <Route
            path="/console"
            element={<Console />}
          />
          <Route
            path="/migrations"
            element={<Migrations />}
          />
          <Route
            exact
            path="/diagram"
            element={<ReactFlow />}
          />
        </Route>
        <Route
          path="*"
          element={<Navigate to="/home" />}
        />
      </Routes>
    </Router>
  );
}
