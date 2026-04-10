import React from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  ClipboardList, 
  Users, 
  LogOut,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext'; 

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth(); 

  // smarter active link detection
  const isActive = (path) => {
    if (path === '/admin') return location.pathname === '/admin';
    return location.pathname.startsWith(path);
  };

  const navLinks = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Products', path: '/admin/products', icon: ShoppingBag },
    { name: 'Orders', path: '/admin/orders', icon: ClipboardList }, 
    { name: 'Users', path: '/admin/users', icon: Users },
  ];

  const handleLogout = () => {
    logout(); 
    navigate('/login'); 
  };

  return (
    <div className="flex min-h-screen bg-[#070707] text-white selection:bg-amber-300 selection:text-black">
      
      {/* Sidebar */}
      <aside className="w-72 bg-black/40 border-r border-amber-300/10 p-8 flex flex-col sticky top-0 h-screen backdrop-blur-2xl">
        
        {/* Admin Logo & Branding */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 bg-amber-300 rounded-lg flex items-center justify-center cursor-pointer" onClick={() => navigate('/')}>
              <span className="text-black font-black text-xs italic">NF</span>
            </div>
            <h1 className="text-2xl font-black text-white italic tracking-tighter uppercase">
              Admin <span className="text-amber-300 underline decoration-amber-300/20 underline-offset-8">Hub</span>
            </h1>
          </div>
          <p className="text-[10px] text-amber-50/20 font-black uppercase tracking-[0.4em] ml-11">Management Suite</p>
        </div>
        
        {/* Navigation Section */}
        <nav className="space-y-3 flex-1">
          {navLinks.map((link) => (
            <Link 
              key={link.path}
              to={link.path} 
              className={`flex items-center justify-between group p-4 rounded-[1.5rem] transition-all duration-500 border ${
                isActive(link.path) 
                ? 'bg-amber-300/10 border-amber-300/20 text-amber-300 shadow-[0_0_20px_rgba(251,191,36,0.05)]' 
                : 'border-transparent text-white/40 hover:bg-white/[0.03] hover:text-white'
              }`}
            >
              <div className="flex items-center gap-4 font-black uppercase tracking-[0.15em] text-[10px]">
                <link.icon size={18} className={`${isActive(link.path) ? 'text-amber-300' : 'text-white/20 group-hover:text-amber-300'} transition-colors`} />
                {link.name}
              </div>
              {isActive(link.path) && <ChevronRight size={14} className="animate-pulse" />}
            </Link>
          ))}
        </nav>

        {/* Bottom Section: Logout */}
        <div className="pt-8 border-t border-amber-300/10">
          <button 
            className="w-full flex items-center gap-4 p-4 rounded-[1.5rem] text-red-500/40 hover:bg-red-500/5 hover:text-red-400 transition-all duration-300 group font-black uppercase tracking-[0.15em] text-[10px]"
            onClick={handleLogout}
          >
            <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
            Logout Session
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-amber-300/[0.02] via-transparent to-transparent overflow-y-auto">
        <div className="max-w-[1400px] mx-auto p-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;