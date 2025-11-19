/* eslint-disable @typescript-eslint/no-explicit-any */
// UserForm.js
import { useState } from 'react';
import './UserForm.css';
import type { IUser } from '../../types';
import { Button } from '@mui/material';

interface UserFormProps {
  user: IUser | null;
  onSubmit: (user: IUser) => void;
  onCancel: () => void;
  isEditing: boolean;
}

const UserForm = ({ user, onSubmit, onCancel, isEditing }: UserFormProps) => {
  const [formData, setFormData] = useState({
    businessName: user?.businessName || '',
    phone: user?.phone || '',
    gstNumber: user?.gstNumber || '',
    businessAddress: user?.businessAddress || null,
    joiningDate: user?.joiningDate || '',
    subscriptionStatus: user?.subscriptionStatus || 'inactive',
    email: user?.email || ''
  } as IUser);

  const [errors, setErrors] = useState({
    businessName: '',
    businessAddress: null,
    phone: '',
    gstNumber: '',
    email: ''
  });

  const validateForm = () => {
    const newErrors = {
      businessName: '',
      businessAddress: null,
      phone: '',
      gstNumber: '',
      email: ''
    };

    if (!formData.businessName.trim()) {
      newErrors.businessName = 'Business Name is required';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = 'Phone number must be 10 digits';
    }

    if (!formData.gstNumber.trim()) {
      newErrors.gstNumber = 'GST number is required';
    }
    // else if (!/\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}[Z]{1}[A-Z\d]{1}/.test(formData.gstNumber)) {
    //   newErrors.gstNumber = 'Invalid GST number format';
    // }

    setErrors(newErrors);

    return (
      !newErrors.businessName &&
      !newErrors.phone &&
      !newErrors.gstNumber
    );
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    /* if (errors[firstname]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    } */
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (validateForm()) {
      const userData: IUser = {
        uuid: user?.uuid || '',
        businessName: formData?.businessName || '',
        businessAddress: formData?.businessAddress || null,
        email: formData?.email || '',
        phone: formData.phone,
        gstNumber: formData.gstNumber,
        subscriptionStatus: formData?.subscriptionStatus || 'inactive',
        joiningDate: formData?.joiningDate || new Date().toISOString()
      };
      onSubmit(userData);
    }
  };

  return (
    <div className="user-form-overlay">
      <div className="user-form-container">
        <div className="form-header">
          <h2>{isEditing ? 'Edit Buyer Details' : 'Create New Buyer'}</h2>
          <button className="close-btn" onClick={onCancel}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="user-form">
          <div className="form-group">
            <label htmlFor="businessName">User/Proprieter Name *</label>
            <input
              type="text"
              id="businessName"
              name="businessName"
              value={formData.businessName}
              onChange={handleChange}
              className={errors.businessName ? 'error' : ''}
              placeholder="Enter Business name"
              required
            />
            {errors.businessName && <span className="error-text">{errors.businessName}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone Number *</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              disabled={isEditing}
              onChange={handleChange}
              className={errors.phone ? 'error' : ''}
              placeholder="Enter 10-digit phone number"
              maxLength={10}
            />
            {errors.phone && <span className="error-text">{errors.phone}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="gstNumber">GST Number *</label>
            <input
              type="text"
              id="gstNumber"
              name="gstNumber"
              value={formData.gstNumber}
              disabled={isEditing}
              onChange={handleChange}
              className={errors.gstNumber ? 'error' : ''}
              placeholder="Enter GST number"
            />
            {errors.gstNumber && <span className="error-text">{errors.gstNumber}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? 'error' : ''}
              placeholder="Enter email address"
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>

          <div className="form-actions">
            <Button variant="text" onClick={onCancel}>
              <span>Cancel</span>
            </Button>
            <Button type="submit" variant="contained">
              <span>{isEditing ? 'Update User' : 'Create User'}</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserForm;