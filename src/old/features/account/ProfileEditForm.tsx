import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FaSave } from 'react-icons/fa';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';

// Define a type for the data structure the form will handle
interface FormData {
  name: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
}

export const ProfileEditForm: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // On component mount, fetch the current user data to pre-fill the form fields
  useEffect(() => {
    fetch('/data/mock-user-data.json')
      .then(res => res.json())
      .then(data => {
        setFormData({
          name: data.profile.name,
          phone: data.profile.phone,
          street: data.shippingAddress.street,
          city: data.shippingAddress.city,
          state: data.shippingAddress.state,
          zipCode: data.shippingAddress.zipCode,
        });
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Failed to load user data:", err);
        toast.error("Could not load profile data.");
        setIsLoading(false);
      });
  }, []);

  // Generic handler to update the form state as the user types
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => (prev ? { ...prev, [name]: value } : null));
  };

  // Handler for when the user submits the form
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    toast.loading('Saving changes...');

    // Simulate an API call to save the data
    setTimeout(() => {
      setIsSaving(false);
      toast.dismiss();
      toast.success('Profile updated successfully!');
      // After saving, navigate the user back to the read-only view
      navigate('/account'); 
    }, 1500); // Simulate 1.5 second network delay
  };

  // A helper function to reduce repetition when creating input fields
  const renderInput = (id: keyof FormData, label: string, type = 'text') => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-700">{label}</label>
        <input
            type={type}
            id={id}
            name={id}
            value={formData?.[id] || ''}
            onChange={handleInputChange}
            required
            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
        />
    </div>
  );

  if (isLoading) {
    return <div className="flex justify-center p-10"><LoadingSpinner /></div>;
  }

  if (!formData) {
    return <div className="text-red-500">There was a problem loading the edit form.</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Edit Your Profile</h2>
      <form onSubmit={handleFormSubmit} className="space-y-8">
        <fieldset className="space-y-4">
            <legend className="text-lg font-semibold text-gray-700 pb-2 border-b">Personal Details</legend>
            {renderInput('name', 'Full Name')}
            {renderInput('phone', 'Phone Number', 'tel')}
        </fieldset>
        
        <fieldset className="space-y-4">
            <legend className="text-lg font-semibold text-gray-700 pb-2 border-b">Shipping Address</legend>
            {renderInput('street', 'Street Address')}
            {renderInput('city', 'City')}
            {renderInput('state', 'State / Province')}
            {renderInput('zipCode', 'ZIP / Postal Code')}
        </fieldset>

        {/* Action Buttons */}
        <div className="pt-5 flex justify-end gap-4 border-t">
          <button
            type="button"
            onClick={() => navigate('/account')} // Cancel button navigates back to the read-only view
            className="bg-gray-200 text-gray-800 font-bold py-2.5 px-6 rounded-lg hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center gap-2 justify-center bg-orange-600 text-white font-bold py-2.5 px-6 rounded-lg hover:bg-orange-700 disabled:opacity-60"
          >
            <FaSave />
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};