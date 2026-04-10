import React, { useEffect, useState } from "react";
import { getAllUsers, updateUserByAdmin, deleteUser } from "../../services/admin.service";
import { FaTrash, FaUserShield, FaUserEdit, FaBan, FaCheckCircle } from "react-icons/fa";
import Swal from "sweetalert2"; 

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // ১. user data fetch
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

  // ২. user role or block status 
  const handleUpdateStatus = async (id, currentRole, currentBlockStatus) => {
    const { value: formValues } = await Swal.fire({
      title: '<span style="color: #ffcc00">Update User Status</span>',
      html:
        `<select id="swal-role" class="swal2-input" style="background: #1a1a1a; color: white;">
          <option value="Customer" ${currentRole === 'Customer' ? 'selected' : ''}>Customer</option>
          <option value="Admin" ${currentRole === 'Admin' ? 'selected' : ''}>Admin</option>
        </select>` +
        `<div style="margin-top: 10px; color: white;">
          <input type="checkbox" id="swal-block" ${currentBlockStatus ? 'checked' : ''}> Block this user
        </div>`,
      background: '#111',
      confirmButtonColor: '#ffcc00',
      focusConfirm: false,
      preConfirm: () => {
        return {
          role: document.getElementById('swal-role').value,
          isBlocked: document.getElementById('swal-block').checked
        }
      }
    });

    if (formValues) {
      try {
        await updateUserByAdmin(id, formValues);
        Swal.fire("Updated!", "User has been updated.", "success");
        fetchUsers(); 
      } catch (error) {
        Swal.fire("Error", error.response?.data?.message || "Failed to update", "error");
      }
    }
  };

  // ৩. user delete
  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      background: '#111',
      color: '#fff'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteUser(id);
          Swal.fire("Deleted!", "User has been removed.", "success");
          fetchUsers();
        } catch (error) {
          Swal.fire("Error", error.response?.data?.message || "Failed to delete", "error");
        }
      }
    });
  };

  if (loading) return <div className="text-center mt-10 text-gold">Loading Users...</div>;

  return (
    <div className="p-6 bg-[#0a0a0a] min-h-screen text-white">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">
          User Management
        </h2>
        <div className="bg-[#1a1a1a] px-4 py-2 rounded-lg border border-yellow-600/30">
          Total Users: <span className="text-yellow-500 font-bold">{users.length}</span>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-yellow-600/20 bg-[#111]">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#1a1a1a] text-yellow-500 uppercase text-sm tracking-wider">
              <th className="p-4 border-b border-yellow-600/20">Name</th>
              <th className="p-4 border-b border-yellow-600/20">Email</th>
              <th className="p-4 border-b border-yellow-600/20">Role</th>
              <th className="p-4 border-b border-yellow-600/20">Status</th>
              <th className="p-4 border-b border-yellow-600/20 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="hover:bg-yellow-600/5 transition-all duration-200">
                <td className="p-4 border-b border-yellow-600/10 font-medium">{user.name}</td>
                <td className="p-4 border-b border-yellow-600/10 text-gray-400">{user.email}</td>
                <td className="p-4 border-b border-yellow-600/10">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    user.role === 'Admin' ? 'bg-yellow-600/20 text-yellow-500 border border-yellow-500/50' : 'bg-blue-600/20 text-blue-400'
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="p-4 border-b border-yellow-600/10">
                  {user.isBlocked ? (
                    <span className="flex items-center text-red-500 text-sm italic">
                      <FaBan className="mr-1" /> Blocked
                    </span>
                  ) : (
                    <span className="flex items-center text-green-500 text-sm">
                      <FaCheckCircle className="mr-1" /> Active
                    </span>
                  )}
                </td>
                <td className="p-4 border-b border-yellow-600/10 text-center">
                  <button 
                    onClick={() => handleUpdateStatus(user._id, user.role, user.isBlocked)}
                    className="mr-3 text-yellow-500 hover:text-yellow-300 transition-colors"
                    title="Edit Role/Status"
                  >
                    <FaUserEdit size={18} />
                  </button>
                  <button 
                    onClick={() => handleDelete(user._id)}
                    className="text-red-500 hover:text-red-300 transition-colors"
                    title="Delete User"
                  >
                    <FaTrash size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsers;