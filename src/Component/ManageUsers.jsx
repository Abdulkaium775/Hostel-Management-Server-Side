import React, { useEffect, useState } from 'react';
import axiosInstance from '../Api/axios'; // Your configured axios instance
import Swal from 'sweetalert2';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  // Pagination states (optional)
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);

  // Fetch users from server with search and pagination
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get('/users', {
        params: { search, page, limit },
      });
      setUsers(res.data.users);
      setTotal(res.data.total);
    } catch (err) {
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch users when search or page changes
  useEffect(() => {
    fetchUsers();
  }, [search, page]);

  // Handle making a user admin
  const makeAdmin = async (id, email) => {
    const confirm = await Swal.fire({
      title: 'Make Admin?',
      text: `Are you sure you want to make ${email} an admin?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, make admin!',
    });

    if (!confirm.isConfirmed) return;

    try {
      const res = await axiosInstance.patch(`/users/${id}/make-admin`);
      if (res.data.success) {
        Swal.fire('Success', 'User is now an admin!', 'success');
        fetchUsers(); // Refresh user list
      } else {
        Swal.fire('Error', res.data.message || 'Could not update user', 'error');
      }
    } catch (err) {
      console.error('Error making admin:', err);
      Swal.fire('Error', 'Could not update user', 'error');
    }
  };

  // Calculate total pages for pagination
  const totalPages = Math.ceil(total / limit);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Manage Users</h2>

      <input
        type="text"
        placeholder="Search by name or email"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1); // Reset to first page on new search
        }}
        className="mb-4 px-3 py-2 border rounded w-full max-w-sm"
      />

      {loading ? (
        <p>Loading users...</p>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 border">#</th>
                  <th className="px-4 py-2 border">Username</th>
                  <th className="px-4 py-2 border">Email</th>
                  <th className="px-4 py-2 border">Subscription</th>
                  <th className="px-4 py-2 border">Role</th>
                  <th className="px-4 py-2 border">Action</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 && (
                  <tr>
                    <td colSpan="6" className="text-center py-4">
                      No users found
                    </td>
                  </tr>
                )}
                {users.map((user, idx) => (
                  <tr key={user._id} className="text-center">
                    <td className="px-4 py-2 border">{(page - 1) * limit + idx + 1}</td>
                    <td className="px-4 py-2 border">{user.displayName || 'N/A'}</td>
                    <td className="px-4 py-2 border">{user.email}</td>
                    <td className="px-4 py-2 border">{user.badge || 'Bronze'}</td>
                    <td className="px-4 py-2 border">{user.role}</td>
                    <td className="px-4 py-2 border">
                      {user.role === 'admin' ? (
                        <span className="text-green-600 font-bold">Admin</span>
                      ) : (
                        <button
                          onClick={() => makeAdmin(user._id, user.email)}
                          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                        >
                          Make Admin
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="mt-4 flex justify-center gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
              >
                Prev
              </button>
              <span className="px-3 py-1 rounded border">
                Page {page} of {totalPages}
              </span>
              <button
                disabled={page === totalPages}
                onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ManageUsers;
