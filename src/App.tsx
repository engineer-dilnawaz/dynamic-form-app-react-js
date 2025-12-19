import { BrowserRouter, Routes, Route, Link, Outlet } from 'react-router-dom';
import AdminDashboard from './views/admin/Dashboard';
import SchemaBuilder from './views/admin/SchemaBuilder';
import UserDashboard from './views/user/Dashboard';
import DynamicForm from './views/user/DynamicForm';
import EntriesViewer from './views/user/EntriesViewer';
import { Shield, User } from 'lucide-react';

const Home = () => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 space-y-12">
    <div className="text-center space-y-4">
      <h1 className="text-5xl font-extrabold text-gray-900 tracking-tight">Dynamic Form Builder</h1>
      <p className="text-lg text-gray-500 max-w-lg mx-auto">
        Create custom forms with the Admin Builder, then switch to User mode to fill them out.
      </p>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl px-4">
      <Link to="/admin" className="relative p-10 bg-white border border-gray-200 rounded-2xl hover:shadow-xl transition-all duration-300 group overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="relative flex flex-col items-center text-center space-y-4">
          <div className="p-4 bg-blue-100 rounded-full group-hover:bg-blue-600 group-hover:text-white transition-colors">
            <Shield className="w-8 h-8 text-blue-600 group-hover:text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800">Admin</h2>
          <p className="text-gray-500">Design schemas, manage categories, and configure field types.</p>
        </div>
      </Link>
      
      <Link to="/user" className="relative p-10 bg-white border border-gray-200 rounded-2xl hover:shadow-xl transition-all duration-300 group overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="relative flex flex-col items-center text-center space-y-4">
           <div className="p-4 bg-green-100 rounded-full group-hover:bg-green-600 group-hover:text-white transition-colors">
            <User className="w-8 h-8 text-green-600 group-hover:text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800">User</h2>
          <p className="text-gray-500">Browse available forms, fill entries, and view submissions.</p>
        </div>
      </Link>
    </div>
  </div>
);

const AdminLayout = () => (
  <div className="min-h-screen bg-gray-50">
    <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
         <div className="flex items-center space-x-2">
            <Shield className="w-6 h-6 text-blue-600" />
            <span className="font-bold text-xl text-gray-900">Admin Console</span>
         </div>
         <Link to="/" className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">Sign Out</Link>
      </div>
    </div>
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Outlet />
    </div>
  </div>
);

const UserLayout = () => (
   <div className="min-h-screen bg-gray-50">
    <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <User className="w-6 h-6 text-green-600" />
            <span className="font-bold text-xl text-gray-900">User Portal</span>
         </div>
         <Link to="/" className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">Sign Out</Link>
      </div>
    </div>
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Outlet />
    </div>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        
        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="new" element={<SchemaBuilder />} />
          <Route path="edit/:id" element={<SchemaBuilder />} />
        </Route>

        {/* User Routes */}
        <Route path="/user" element={<UserLayout />}>
           <Route index element={<UserDashboard />} />
           <Route path="form/:id" element={<DynamicForm />} />
           <Route path="entries" element={<EntriesViewer />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;