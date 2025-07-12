import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  Upload, 
  FileSearch, 
  Search, 
  BarChart3, 
  Settings,
  Brain,
  Database
} from 'lucide-react';

const Sidebar: React.FC = () => {
  const navItems = [
    { to: '/', icon: Home, label: 'Dashboard' },
    { to: '/upload', icon: Upload, label: 'Upload Documents' },
    { to: '/analysis', icon: Brain, label: 'Document Analysis' },
    { to: '/search', icon: Search, label: 'Search Documents' },
    { to: '/analytics', icon: BarChart3, label: 'Analytics' },
    { to: '/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <aside className="w-64 bg-white shadow-sm border-r border-gray-200 min-h-screen">
      <nav className="p-4">
        <ul className="space-y-2">
          {navItems.map(({ to, icon: Icon, label }) => (
            <li key={to}>
              <NavLink
                to={to}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`
                }
              >
                <Icon className="h-5 w-5" />
                <span>{label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="p-4 mt-8">
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-900 mb-2">System Status</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-600">MongoDB</span>
              <span className="h-2 w-2 bg-green-500 rounded-full"></span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-600">Tika Server</span>
              <span className="h-2 w-2 bg-green-500 rounded-full"></span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-600">AI Service</span>
              <span className="h-2 w-2 bg-green-500 rounded-full"></span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;