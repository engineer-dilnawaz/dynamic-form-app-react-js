import { BrowserRouter, Routes, Route, Link, Outlet, useLocation } from 'react-router-dom';
import AdminDashboard from './views/admin/Dashboard';
import SchemaBuilder from './views/admin/SchemaBuilder';
import UserDashboard from './views/user/Dashboard';
import DynamicForm from './views/user/DynamicForm';
import EntriesViewer from './views/user/EntriesViewer';
import { Shield, User, LayoutGrid, FileText } from 'lucide-react';

// Shared Sidebar/Header could be extracted, but keeping inline for simplicity in this artifact
const NavLink = ({ to, icon: Icon, children }: { to: string, icon: any, children: React.ReactNode }) => {
    const location = useLocation();
    const isActive = location.pathname === to || location.pathname.startsWith(`${to}/`);
    
    return (
        <Link to={to} className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive ? 'bg-brand-primary/10 text-brand-primary' : 'text-gray-400 hover:text-white hover:bg-brand-surface'}`}>
            <Icon className="w-5 h-5" />
            <span className="font-medium">{children}</span>
        </Link>
    );
};

const AdminLayout = () => (
  <div className="min-h-screen flex bg-brand-dark">
     {/* Sidebar */}
    <div className="w-64 border-r border-brand-border p-6 flex flex-col hidden md:flex">
         <div className="flex items-center space-x-2 px-4 mb-10">
            <div className="w-8 h-8 bg-brand-primary rounded flex items-center justify-center">
                <Shield className="w-5 h-5 text-black" />
            </div>
            <span className="font-bold text-xl text-white tracking-tight">SchemaBuilder</span>
         </div>
         
         <nav className="flex-1 space-y-2">
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-widest px-4 mb-4">Management</div>
            <NavLink to="/admin" icon={LayoutGrid}>Dashboard</NavLink>
         </nav>

         <div className="mt-auto pt-6 border-t border-brand-border">
            <Link to="/" className="flex items-center space-x-3 px-4 py-2 text-gray-400 hover:text-white transition-colors">
                <span className="text-sm">Main Menu</span>
            </Link>
         </div>
    </div>
    
    <div className="flex-1 flex flex-col">
        {/* Mobile Header */}
        <div className="md:hidden h-16 border-b border-brand-border flex items-center justify-between px-4 bg-brand-dark">
             <span className="font-bold text-white">SchemaBuilder</span>
             <Link to="/" className="text-sm text-gray-400">Exit</Link>
        </div>

        <main className="flex-1 p-6 md:p-12 overflow-y-auto">
            <Outlet />
        </main>
    </div>
  </div>
);

const UserLayout = () => (
   <div className="min-h-screen flex bg-brand-dark">
    {/* Sidebar */}
    <div className="w-64 border-r border-brand-border p-6 flex flex-col hidden md:flex">
         <div className="flex items-center space-x-2 px-4 mb-10">
            <div className="w-8 h-8 bg-brand-primary rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-black" />
            </div>
            <span className="font-bold text-xl text-white tracking-tight">FormUser</span>
         </div>
         
         <nav className="flex-1 space-y-2">
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-widest px-4 mb-4">Portal</div>
            <NavLink to="/user" icon={LayoutGrid}>Dashboard</NavLink>
            <NavLink to="/user/entries" icon={FileText}>My Entries</NavLink>
         </nav>

         <div className="mt-auto pt-6 border-t border-brand-border">
            <Link to="/" className="flex items-center space-x-3 px-4 py-2 text-gray-400 hover:text-white transition-colors">
                <span className="text-sm">Main Menu</span>
            </Link>
         </div>
    </div>

    <div className="flex-1 flex flex-col">
         {/* Mobile Header */}
        <div className="md:hidden h-16 border-b border-brand-border flex items-center justify-between px-4 bg-brand-dark">
             <span className="font-bold text-white">FormUser</span>
             <Link to="/" className="text-sm text-gray-400">Exit</Link>
        </div>
        
        <main className="flex-1 p-6 md:p-12 overflow-y-auto">
            <Outlet />
        </main>
    </div>
  </div>
);

const Home = () => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-brand-dark relative overflow-hidden">
    {/* Background Glow */}
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-brand-primary/10 blur-[120px] rounded-full pointer-events-none" />

    <div className="relative z-10 text-center space-y-6 max-w-2xl px-6">
      <div className="inline-flex items-center justify-center p-3 bg-brand-surface rounded-2xl border border-brand-border mb-4 shadow-2xl">
         <span className="text-brand-primary font-bold tracking-widest uppercase text-sm">Dynamic Engine v2.0</span>
      </div>
      
      <h1 className="text-6xl font-extrabold text-white tracking-tight leading-tight">
        Build Forms <span className="text-brand-primary">Faster</span>.
      </h1>
      <p className="text-xl text-gray-400">
        The advanced schema builder for modern applications. Define data structures and generate UIs instantly.
      </p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full pt-8">
        <Link to="/admin" className="group relative p-8 bg-brand-surface border border-brand-border rounded-2xl hover:border-brand-primary/50 transition-all hover:-translate-y-1">
            <div className="absolute top-4 right-4 text-brand-border group-hover:text-brand-primary transition-colors">
                <Shield className="w-6 h-6" />
            </div>
            <div className="text-left">
                <div className="text-2xl font-bold text-white mb-2">Admin</div>
                <p className="text-sm text-gray-500">Schema Management</p>
            </div>
        </Link>
        
        <Link to="/user" className="group relative p-8 bg-brand-surface border border-brand-border rounded-2xl hover:border-brand-primary/50 transition-all hover:-translate-y-1">
             <div className="absolute top-4 right-4 text-brand-border group-hover:text-brand-primary transition-colors">
                <User className="w-6 h-6" />
            </div>
            <div className="text-left">
                <div className="text-2xl font-bold text-white mb-2">User Portal</div>
                <p className="text-sm text-gray-500">Form Submission</p>
            </div>
        </Link>
      </div>
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