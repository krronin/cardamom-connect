// UserList.js
import { useState } from "react";
import "../assets/styles/UserList.scss";
import { Container, Button } from "@mui/material";
import type { IUser } from "../types";

interface UserListProps {
  users: IUser[];
  onEdit: (user: IUser) => void;
  onDelete: (uuid: string) => void;
}

const UserList = ({ users, onEdit, onDelete }: UserListProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredUsers = users.filter(
    (user: IUser) =>
      user.businessName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone?.includes(searchTerm) ||
      user.gstNumber?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (users.length === 0) {
    return (
      <Container className="user-list">
        <div className="empty-state">
          <h3>No Users Found</h3>
          <p>Create your first user to get started</p>
        </div>
      </Container>
    );
  }

  return (
      <Container className="user-list">
        <div className="list-header">
          <h3>User Management ({users.length} users)</h3>
          <div className="search-box">
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="users-table">
          <table>
            <thead>
              <tr>
                <th>User ID</th>
                <th>Business Name</th>
                <th>Phone</th>
                <th>GST Number</th>
                <th>Created Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user: IUser) => (
                <tr key={user.uuid}>
                  <td className="user-id">{user.uuid}</td>
                  <td className="user-name">{user.businessName}</td>
                  <td className="user-phone">{user.phone}</td>
                  <td className="user-gst">{user.gstNumber}</td>
                  <td className="user-date">{formatDate(user.joiningDate)}</td>
                  <td className="user-actions">
                    <Button variant="contained" onClick={() => onEdit(user)}>
                      <span>Edit</span>
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={() => onDelete(user.uuid)}
                    >
                      <span>Delete</span>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && searchTerm && (
          <div className="no-results">
            No users found matching "{searchTerm}"
          </div>
        )}
      </Container>
  );
};

export default UserList;
