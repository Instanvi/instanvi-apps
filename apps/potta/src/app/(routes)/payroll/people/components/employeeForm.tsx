'use client';
import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import Button from '@potta/components/button';
import CustomLoader from '@potta/components/loader';

interface EmployeeFormProps {
  personId?: string | null;
  onClose: () => void;
  onSave: () => void;
  viewOnly?: boolean;
}

const EmployeeForm = ({ personId, onClose, onSave, viewOnly = false }: EmployeeFormProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [employeeData, setEmployeeData] = useState<any>(null);

  // Fetch employee data when component mounts
  useEffect(() => {
    if (personId) {
      fetchEmployeeData(personId);
    } else {
      // If no personId, we're creating a new employee
      setIsLoading(false);
    }
  }, [personId]);

  const fetchEmployeeData = async (id: string) => {
    try {
      // Replace with your actual API call
      // const data = await peopleApi.getPerson(id);
      // Mock data for now
      const data = {
        firstName: 'Janifer',
        lastName: 'Hudson',
        email: 'hi@yourdomain.com',
        phone: '+237 654 666 765',
        matricule: '#988-987',
        jobTitle: 'Sr Marketing Manager',
        gender: 'Female',
        date_of_birth: '1990-01-01',
        marital_status: 'Married',
      };
      
      setEmployeeData(data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching employee data:', error);
      toast.error('Failed to load employee data');
      onClose();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (viewOnly) {
      onClose();
      return;
    }
    
    // Save logic here
    toast.success('Employee information saved successfully');
    onSave();
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-[999] flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-4xl">
          <div className="flex justify-center">
            <CustomLoader />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[999] flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white p-4 border-b flex justify-between items-center z-10">
          <h2 className="text-xl font-bold">
            {viewOnly ? 'View Employee' : personId ? 'Edit Employee' : 'New Employee'}
            {employeeData && (
              <span className="ml-2 text-gray-500 text-base">
                {employeeData.firstName} {employeeData.lastName}
              </span>
            )}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="flex flex-col space-y-6">
            {/* Tab navigation similar to the image */}
            <div className="flex border-b">
              <div className="px-4 py-2 border-b-2 border-green-600 text-green-600 font-medium">Personal</div>
              <div className="px-4 py-2 text-gray-500">Job</div>
              <div className="px-4 py-2 text-gray-500">Benefits</div>
              <div className="px-4 py-2 text-gray-500">Timesheet</div>
              <div className="px-4 py-2 text-gray-500">Pay Info</div>
              <div className="px-4 py-2 text-gray-500">Performance</div>
              <div className="px-4 py-2 text-gray-500">PTO</div>
              <div className="px-4 py-2 text-gray-500">Documents</div>
            </div>

            {/* Employee Matricule */}
            <div className="space-y-2">
              <label htmlFor="matricule" className="block text-sm font-medium text-gray-700">
                Employee Matricule
              </label>
              <input
                type="text"
                id="matricule"
                name="matricule"
                className="w-full p-2 border border-gray-300 rounded-md"
                defaultValue={employeeData?.matricule || '#'}
                readOnly={viewOnly}
              />
            </div>

            {/* Job Title */}
            <div className="space-y-2">
              <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-700">
                Job Title
              </label>
              <input
                type="text"
                id="jobTitle"
                name="jobTitle"
                className="w-full p-2 border border-gray-300 rounded-md"
                defaultValue={employeeData?.jobTitle || ''}
                readOnly={viewOnly}
              />
            </div>

            {/* Name fields in a row */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  defaultValue={employeeData?.firstName || ''}
                  readOnly={viewOnly}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  defaultValue={employeeData?.lastName || ''}
                  readOnly={viewOnly}
                />
              </div>
            </div>

            {/* Phone and WhatsApp toggle */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  Telephone Number
                </label>
                <input
                  type="text"
                  id="phone"
                  name="phone"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  defaultValue={employeeData?.phone || ''}
                  readOnly={viewOnly}
                />
              </div>
              <div className="flex items-center space-x-2 mt-6">
                <span className="text-sm text-gray-700">WhatsApp: No?</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked={false} disabled={viewOnly} />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                </label>
              </div>
            </div>

            {/* Email Address */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="w-full p-2 border border-gray-300 rounded-md"
                defaultValue={employeeData?.email || ''}
                readOnly={viewOnly}
              />
            </div>

            {/* Birth Date and Marital Status */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700">
                  Birth Date (26)
                </label>
                <div className="relative">
                  <input
                    type="date"
                    id="birthDate"
                    name="birthDate"
                    className="w-full p-2 border border-gray-300 rounded-md"
                    defaultValue={employeeData?.date_of_birth || ''}
                    readOnly={viewOnly}
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="maritalStatus" className="block text-sm font-medium text-gray-700">
                  Marital Status
                </label>
                <div className="relative">
                  <select
                    id="maritalStatus"
                    name="maritalStatus"
                    className="w-full p-2 border border-gray-300 rounded-md appearance-none"
                    defaultValue={employeeData?.marital_status || 'Single'}
                    disabled={viewOnly}
                  >
                    <option value="Single">Single</option>
                    <option value="Married">Married</option>
                    <option value="Divorced">Divorced</option>
                    <option value="Widowed">Widowed</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Gender */}
            <div className="space-y-2">
              <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
                Gender
              </label>
              <div className="relative">
                <select
                  id="gender"
                  name="gender"
                  className="w-full p-2 border border-gray-300 rounded-md appearance-none"
                  defaultValue={employeeData?.gender || 'Male'}
                  disabled={viewOnly}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Submit button */}
            <div className="pt-4">
              <Button
                text={viewOnly ? "Close" : "Update"}
                type="submit"
                className={viewOnly ? "bg-gray-500 hover:bg-gray-600" : ""}
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmployeeForm;