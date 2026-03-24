import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <div className="h-screen w-64 bg-gray-900 text-white p-5">
      <h2 className="text-2xl font-bold mb-8">Student Admin</h2>

      <ul className="space-y-4">
        <li>
          <Link to="/" className="hover:text-blue-400">Dashboard</Link>
        </li>

        <li>
          <Link to="/students" className="hover:text-blue-400">Students</Link>
        </li>

        <li>
          <Link to="/analytics" className="hover:text-blue-400">Analytics</Link>
        </li>

        <li>
          <Link to="/settings" className="hover:text-blue-400">Settings</Link>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;