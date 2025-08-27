
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AddUser } from './AddUser';

export const AddUserPage = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(true);

  const handleClose = () => {
    setIsOpen(false);
    navigate('/dashboard/superadmin/users');
  };

  const handleAdd = (user: any) => {
    console.log('User added:', user);
    // Here you would typically make an API call to save the user
    navigate('/dashboard/superadmin/users');
  };

  return (
    <AddUser
      isOpen={isOpen}
      onClose={handleClose}
      onAdd={handleAdd}
    />
  );
};
