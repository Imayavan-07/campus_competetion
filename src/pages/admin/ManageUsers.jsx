import React from 'react';

export default function ManageUsers() {
  const users = [
    { id: 1, name: 'Alice Smith', email: 'alice@student.campus.edu', role: 'Student', status: 'Active' },
    { id: 2, name: 'Computer Science Club', email: 'csc@club.campus.edu', role: 'Club', status: 'Active' },
    { id: 3, name: 'Bob Jones', email: 'bob@student.campus.edu', role: 'Student', status: 'Suspended' },
    { id: 4, name: 'Robotics Club', email: 'robotics@club.campus.edu', role: 'Club', status: 'Pending Verification' },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1>Manage Users</h1>
          <p className="text-muted">View and manage all students and clubs registered on the platform.</p>
        </div>
        <div className="flex gap-2">
          <input type="text" placeholder="Search users by name or email..." className="form-control" style={{ width: '300px' }} />
          <button className="btn btn-primary">Search</button>
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '1px solid var(--border-color)' }}>
              <th style={{ padding: '16px 24px', fontWeight: 600 }}>Name</th>
              <th style={{ padding: '16px 24px', fontWeight: 600 }}>Email</th>
              <th style={{ padding: '16px 24px', fontWeight: 600 }}>Role</th>
              <th style={{ padding: '16px 24px', fontWeight: 600 }}>Status</th>
              <th style={{ padding: '16px 24px', fontWeight: 600 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '16px 24px', fontWeight: 500 }}>{user.name}</td>
                <td style={{ padding: '16px 24px' }} className="text-muted">{user.email}</td>
                <td style={{ padding: '16px 24px' }}>
                  <span className={`badge ${user.role === 'Club' ? 'badge-blue' : 'badge-green'}`}>
                    {user.role}
                  </span>
                </td>
                <td style={{ padding: '16px 24px' }}>
                  <span className={`badge ${user.status === 'Active' ? 'badge-green' : user.status === 'Suspended' ? 'badge-orange' : 'badge-blue'}`}>
                    {user.status}
                  </span>
                </td>
                <td style={{ padding: '16px 24px' }}>
                  <button className="btn btn-outline" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>Manage</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
