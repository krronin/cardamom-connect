/* eslint-disable @typescript-eslint/no-explicit-any */
// AdminDashboard.js
import {
  Button,
  CircularProgress,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import { useEffect, useState } from "react";
import UserForm from "../components/forms/UserForm";
import type { IUser } from "../types";
import "../assets/styles/AdminDashboard.scss";
import AdminProfile from "../components/AdminProfile";
import UserList from "../components/UserList";

const AdminDashboard = () => {
  const env = import.meta.env.MODE;
  const apiUrl =
    env === "production"
      ? import.meta.env.VITE_API_URL_PRODUCTION
      : import.meta.env.VITE_API_URL_LOCAL;

  const [dataFetched, setDataFetched] = useState(false);
  const [users, setUsers] = useState(() => [] as IUser[]);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState<IUser | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const fetchUsersFromServer = async () => {
    fetch(apiUrl + "/users")
      .then((response) => response.json())
      .then((data) => {
        setUsers(data);
        setDataFetched(true);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
  };

  // Fetch users from server
  useEffect(() => {
    if (!dataFetched) fetchUsersFromServer();
  }, [dataFetched]);

  const handleListItemClick = (index: number) => {
    setSelectedIndex(index);
  };

  const handleClickAddNewUser = () => {
    setEditingUser(null);
    setShowForm(true);
    setEditingUser(null);
  };

  const handleCreateUser = async (userData: IUser) => {
    const response = await fetch(apiUrl + "/users/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const responseData = await response.json();
    setUsers((prevUsers: IUser[]) => [...prevUsers, responseData.user]);
    setShowForm(false);

    // Show success message with credentials
    alert(`User created successfully!\nID: ${responseData.user.uuid}`);
  };

  const handleEditUser = async (updatedUser: any) => {
    const response = await fetch(apiUrl + "/users/update", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedUser),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const responseData = await response.json();
    setUsers((prevUsers: IUser[]) => [...prevUsers, responseData]);
    setShowForm(false);

    setUsers((prevUsers: any) =>
      prevUsers.map((user: any) =>
        user.uuid === updatedUser.uuid ? { ...user, ...updatedUser } : user
      )
    );
    setEditingUser(updatedUser);
    // Show success message with credentials
    alert(`User updated successfully!\nID: ${updatedUser.uuid}`);
    setShowForm(false);
  };

  const deleteUserFromServer = async (uuid: string) => {
    const response = await fetch(apiUrl + "/users/delete/" + uuid, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    setShowForm(false);

    setUsers((prevUsers: any) =>
      prevUsers.filter((user: any) => user.uuid !== uuid)
    );
    // Show success message with credentials
    alert(`User deleted successfully!\nID: ${uuid}`);
    setShowForm(false);
  };

  const handleDeleteUser = (uuid: string) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      deleteUserFromServer(uuid);
    }
  };

  const handleEditClick = (user: IUser) => {
    setEditingUser(user);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingUser(null);
  };

  return (
    <div className="admin-dashboard">
      <main>
        <section className="sidebar card">        
          <List>
            <ListItem disablePadding>
              <ListItemButton
                selected={selectedIndex === 0}
                component="a"
                onClick={() => handleListItemClick(0)}
              >
                <ListItemText primary="Users" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton
                selected={selectedIndex === 1}
                component="a"
                onClick={() => handleListItemClick(1)}
              >
                <ListItemText primary="Profile" />
              </ListItemButton>
            </ListItem>
          </List>
        </section>
        <section className="content">
          <Button
            variant="contained"
            disabled={selectedIndex === 1}
            onClick={handleClickAddNewUser}
          >
            <span>Add New User</span>
          </Button>
          <div className="content-details card">
            { showForm && (
              <UserForm
                user={editingUser}
                onSubmit={editingUser ? handleEditUser : handleCreateUser}
                onCancel={handleFormClose}
                isEditing={!!editingUser}
              />
            )}
            {
              selectedIndex === 0 && dataFetched && (
              <UserList
                users={users}
                onEdit={handleEditClick}
                onDelete={handleDeleteUser}
              />
            )}
            { selectedIndex === 0 && !dataFetched && (<CircularProgress />)}
            { selectedIndex === 1 && <AdminProfile /> }
          </div>
        </section>
      </main>
    </div>
  );
};

export default AdminDashboard;
