import React, { useEffect, useState } from "react";
import { getAllUsers, updateUserByAdmin, deleteUser } from "../../services/admin.service";
import { FaTrash, FaUserEdit, FaBan, FaCheckCircle, FaCrown } from "react-icons/fa";
import Swal from "sweetalert2";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // main admin mail
  const MAIN_ADMIN_EMAIL = "sumonkhanbd2003@gmail.com";

  const fetchUsers = async () => {
    try {
      const data = await getAllUsers();
      setUsers(data);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch users", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleUpdateStatus = async (id, currentRole, currentBlockStatus) => {
    const { value: formValues } = await Swal.fire({
      title: '<span style="color: #ffcc00">Manage User Access</span>',
      html:
        `<select id="swal-role" class="swal2-input" style="background: #111; color: white; border: 1px solid #ffcc0044;">
          <option value="Customer" ${currentRole === 'Customer' ? 'selected' : ''}>Customer</option>
          <option value="Admin" ${currentRole === 'Admin' ? 'selected' : ''}>Admin</option>
        </select>` +
        `<div style="margin-top: 15px; color: #aaa; font-size: 14px;">
          <input type="checkbox" id="swal-block" ${currentBlockStatus ? 'checked' : ''}> Suspend/Block User Account
        </div>`,
      background: '#0a0a0a',
      confirmButtonColor: '#ffcc00',
      confirmButtonText: 'Save Changes',
      showCancelButton: true,
      cancelButtonColor: '#333',
      preConfirm: () => ({
        role: document.getElementById('swal-role').value,
        isBlocked: document.getElementById('swal-block').checked
      })
    });

    if (formValues) {
      try {
        await updateUserByAdmin(id, formValues);
        Swal.fire({ icon: 'success', title: 'Updated!', background: '#0a0a0a', color: '#fff' });
        fetchUsers();
      } catch (error) {
        Swal.fire({ icon: 'error', title: 'Action Denied', text: error.response?.data?.message, background: '#0a0a0a', color: '#fff' });
      }
    }
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: "Delete User?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Yes, Delete",
      background: '#0a0a0a',
      color: '#fff'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteUser(id);
          fetchUsers();
          Swal.fire({ title: "Deleted!", icon: "success", background: '#0a0a0a' });
        } catch (error) {
          Swal.fire({ title: "Error", text: error.response?.data?.message, icon: "error", background: '#0a0a0a' });
        }
      }
    });
  };

  if (loading) return <div className="flex justify-center items-center h-screen text-amber-500 animate-pulse">Synchronizing Data...</div>;

  return (
    <div className="p-4 sm:p-8 bg-transparent text-white">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
        <div>
          <h2 className="text-4xl font-black italic tracking-tighter uppercase text-white">
            User <span className="text-amber-300">Management</span>
          </h2>
          <p className="text-xs text-white/20 uppercase tracking-[0.3em] mt-1">Control user access and permissions</p>
        </div>
        <div className="bg-amber-300/5 border border-amber-300/10 px-6 py-3 rounded-2xl backdrop-blur-xl">
          <span className="text-xs uppercase tracking-widest text-white/40">Total Database Entries</span>
          <p className="text-2xl font-black text-amber-300">{users.length}</p>
        </div>
      </div>

      <div className="overflow-x-auto rounded-[2rem] border border-amber-300/5 bg-black/20 backdrop-blur-3xl shadow-2xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-amber-300/5 text-amber-300/50 uppercase text-[10px] tracking-[0.2em] font-black">
              <th className="p-6">Identity</th>
              <th className="p-6">Email Address</th>
              <th className="p-6">Authorization</th>
              <th className="p-6">Status</th>
              <th className="p-6 text-center">Control</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {users.map((user) => {
              const isSuperAdmin = user.email === MAIN_ADMIN_EMAIL;
              
              return (
                <tr key={user._id} className="group hover:bg-amber-300/[0.02] transition-all duration-300 border-b border-white/[0.03]">
                  <td className="p-6 font-bold tracking-tight">
                    <div className="flex items-center gap-2">
                      {user.name}
                      {isSuperAdmin && <FaCrown className="text-amber-400 animate-bounce" size={12} title="Master Admin" />}
                    </div>
                  </td>
                  <td className="p-6 text-white/40">{user.email}</td>
                  <td className="p-6">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                      isSuperAdmin || user.role === 'Admin' 
                      ? 'bg-amber-300/10 border-amber-300/20 text-amber-300 shadow-[0_0_15px_rgba(251,191,36,0.1)]' 
                      : 'bg-white/5 border-white/10 text-white/60'
                    }`}>
                      {isSuperAdmin ? "Master Admin" : (user.role || "Customer")}
                    </span>
                  </td>
                  <td className="p-6">
                    <div className={`flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider ${user.isBlocked ? 'text-red-500' : 'text-emerald-500'}`}>
                      {user.isBlocked ? <><FaBan size={10} /> Suspended</> : <><FaCheckCircle size={10} /> Authorized</>}
                    </div>
                  </td>
                  <td className="p-6 text-center">
                    {!isSuperAdmin ? (
                      <div className="flex justify-center gap-4">
                        <button onClick={() => handleUpdateStatus(user._id, user.role, user.isBlocked)} className="p-2 bg-white/5 rounded-xl text-amber-300 hover:bg-amber-300 hover:text-black transition-all duration-300">
                          <FaUserEdit size={16} />
                        </button>
                        <button onClick={() => handleDelete(user._id)} className="p-2 bg-white/5 rounded-xl text-red-500 hover:bg-red-500 hover:text-white transition-all duration-300">
                          <FaTrash size={14} />
                        </button>
                      </div>
                    ) : (
                      <span className="text-[9px] font-black text-white/10 uppercase tracking-widest border border-white/5 px-4 py-2 rounded-xl">System Protected</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsers;