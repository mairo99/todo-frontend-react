import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import TaskList from "./components/views/TaskList";
import Login from "./components/views/Login";
import Logout from "./components/views/Logout";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<TaskList />} />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
      </Routes>
    </Router>
  );
}

export default App;
