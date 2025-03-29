import React from 'react';
import { useUser } from '../../contexts/UserContext';
import UserProfile from './components/UserProfile';

const UserPage = () => {
  const { user, loading } = useUser();

  return (
    <div>
      <h1>User Profile</h1>
      {loading ? (
        <p>Loading...</p>
      ) : user ? (
        <UserProfile user={user} />
      ) : (
        <p>No user data available.</p>
      )}
    </div>
  );
};

export default UserPage;
