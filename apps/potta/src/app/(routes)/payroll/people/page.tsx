'use client';
import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import moment from 'moment';
import BaseInfo from './components/baseInfo';
import Address from './components/address';
import BankAccount from './components/bankAccount';
import Compensation from './components/compensation';
import EmployeeTaxInformation from './components/employee_tax_information';
import Benefit from './components/benefit/page';
import Schedule from './components/schedule';
import RootLayout from '../../layout';
import Button from '@potta/components/button';
import MyTable from '@potta/components/table';
import { peopleApi } from './utils/api';
import {
  BaseInfoPayload,
  AddressPayload,
  CompensationPayload,
  SchedulePayload,
  BenefitPayload,
  TaxInfoPayload,
  PersonPayload,
  BankAccountPayload,
  FilterParams,
} from './utils/types';
import Search from '@potta/components/search';
import CustomLoader from '@potta/components/loader';

// Define employee type for table
interface Employee {
  uuid: string;
  firstName: string;
  lastName: string;
  email: string;
  start_date: string;
  pay_start_date: string;
  balance: number;
  is_active: boolean;
  matricule?: string; // Optional matricule field
}

// Main component
const People = () => {
  const [active, setActive] = useState('ebi');
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true); // Start with true to show loading state initially
  const [personId, setPersonId] = useState<string | null>(null);
  const [personData, setPersonData] = useState<any>(null);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [modalAnimation, setModalAnimation] = useState('animate-slide-in-top');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [viewMode, setViewMode] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);

  // State for form data
  const [baseInfo, setBaseInfo] = useState<BaseInfoPayload | null>(null);
  const [address, setAddress] = useState<AddressPayload | null>(null);
  const [bankAccount, setBankAccount] = useState<BankAccountPayload | null>(
    null
  );
  const [compensation, setCompensation] = useState<CompensationPayload | null>(
    null
  );
  const [schedule, setSchedule] = useState<SchedulePayload | null>(null);
  const [benefit, setBenefit] = useState<BenefitPayload | null>(null);
  const [taxInfo, setTaxInfo] = useState<TaxInfoPayload | null>(null);

  // Add a key to force re-render of child components when data changes
  const [formKey, setFormKey] = useState(0);

  // Define table columns
  const columns = [
    {
      name: 'Employee',
      selector: (row: Employee) => `${row.firstName} ${row.lastName}`,
      sortable: true,
      cell: (row: Employee) => (
        <div className="flex items-center py-2">
          <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
            {row.firstName?.charAt(0)}
            {row.lastName?.charAt(0)}
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">
              {row.firstName} {row.lastName}
            </div>
            <div className="text-sm text-gray-500">{row.email}</div>
          </div>
        </div>
      ),
    },
    {
      name: 'Matricule',
      selector: (row: Employee) => row.matricule || '',
      sortable: true,
      cell: (row: Employee) => <div>{row.matricule || 'N/A'}</div>,
    },
    {
      name: 'Employment Date',
      selector: (row: Employee) => row.start_date || '',
      sortable: true,
      cell: (row: Employee) => (
        <div>
          {row.start_date
            ? moment(row.start_date).format('MMM DD, YYYY')
            : 'N/A'}
        </div>
      ),
    },
    {
      name: 'Status',
      selector: (row: Employee) => (row.is_active ? 'Active' : 'Inactive'),
      sortable: true,
      cell: (row: Employee) => (
        <div>
          {row.is_active ? (
            <span className="px-2 inline-flex text-md leading-5 font-semibold rounded-full text-green-800">
              Active
            </span>
          ) : (
            <span className="px-2 inline-flex text-md leading-5 font-semibold rounded-full text-red-800">
              Inactive
            </span>
          )}
        </div>
      ),
    },
    {
      name: 'Balance',
      selector: (row: Employee) => row.balance || 0,
      sortable: true,
      cell: (row: Employee) => <div>${(row.balance || 0).toFixed(2)}</div>,
    },
    {
      name: 'Actions',
      selector: (row: Employee) => '',
      cell: (row: Employee) => (
        <div className="flex space-x-3">
          <button
            className="text-blue-600 hover:text-blue-900"
            onClick={() => {
              handleEmployeeAction(row.uuid, true);
            }}
            title="View Employee"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
          </button>
          <button
            className="text-indigo-600 hover:text-indigo-900"
            onClick={() => {
              handleEmployeeAction(row.uuid, false);
            }}
            title="Edit Employee"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </button>
          <button
            className="text-red-600 hover:text-red-900"
            onClick={() => handleDeleteEmployee(row.uuid)}
            title="Delete Employee"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      ),
    },
  ];

  // Handle employee action (view or edit)
  const handleEmployeeAction = async (id: string, isViewMode: boolean) => {
    // Clear any previous data
    clearFormData();

    // Set the person ID and view mode
    setPersonId(id);
    setViewMode(isViewMode);

    // Reset to first tab
    setActive('ebi');

    // Open the modal
    setModalAnimation('animate-slide-in-top');
    setShowModal(true);

    // Fetch the employee data
    setIsFetching(true);
    setDataLoaded(false);

    try {
      const data = await peopleApi.getPerson(id);
      setPersonData(data);

      // Populate form data
      populateFormData(data);
      setDataLoaded(true);
    } catch (error) {
      console.error('Error fetching employee data:', error);
      toast.error('Failed to load employee data');
      closeModalWithoutConfirmation();
    } finally {
      setIsFetching(false);
    }
  };

  // Populate all form data from employee data
  const populateFormData = (data: any) => {
    if (!data) return;

    // Base info
    const newBaseInfo = {
      firstName: data.firstName || '',
      lastName: data.lastName || '',
      email: data.email || '',
      phoneNumber: data.phone || '',
      gender: data.gender
        ? data.gender.charAt(0).toUpperCase() + data.gender.slice(1)
        : 'Male',
      birthday: data.date_of_birth || '',
      employmentType: data.employment_type || 'Employee',
      employmentDate: data.start_date || '',
      maritalStatus: data.marital_status || 'Single',
      taxPayerNumber: data.tax_payer_number || '',
      nationalId: data.national_identification_number || '',
      employeeId: data.uuid || '',
      jobTitle: data.jobTitle || '',
      roleId: data.role_id || '',
      matricule: data.matricule || '',
    };
    setBaseInfo(newBaseInfo);

    // Address
    if (data.address) {
      const newAddress = {
        address: data.address.address || '',
        city: data.address.city || '',
        state: data.address.state || '',
        country: data.address.country || '',
        postalCode: data.address.postalCode || '',
        latitude: data.address.latitude || 0,
        longitude: data.address.longitude || 0,
      };
      setAddress(newAddress);
    }

    // Compensation
    const newCompensation = {
      personId: data.uuid,
      hourlyRate: data.hourly_rate || 0,
      salary: data.base_pay || 0,
      paymentFrequency: data.compensation_schedule || 'Monthly',
      eligibleForTips: data.eligible_for_tips || false,
      eligibleForOvertime: data.eligible_for_overtime || false,
      paid_time_off: data.paidTimeOff || [],
    };
    setCompensation(newCompensation);

    // Schedule
    const newSchedule = {
      personId: data.uuid,
      payScheduleId: data.pay_schedule?.uuid || '',
      payCycleName: data.compensation_schedule || '',
      firstPayDate: data.pay_schedule?.first_pay_date || '',
      endPayDate: data.pay_schedule?.end_date || '',
    };
    setSchedule(newSchedule);

    // Bank account will be fetched separately when needed

    // Increment key to force re-render of components with new data
    setFormKey((prev) => prev + 1);
  };

  // Clear form data
  const clearFormData = () => {
    setBaseInfo(null);
    setAddress(null);
    setBankAccount(null);
    setCompensation(null);
    setSchedule(null);
    setBenefit(null);
    setTaxInfo(null);
    setPersonData(null);
    setDataLoaded(false);
  };

  // Fetch all employees on initial load
  useEffect(() => {
    fetchEmployees();
  }, [currentPage, pageSize]);

  const fetchEmployees = async () => {
    setIsFetching(true);
    try {
      // Use filterPersons method with pagination parameters
      const filterParams: FilterParams = {
        page: currentPage,
        pageSize: pageSize,
        isActive: true, // Only fetch active employees
        sortBy: 'firstName', // Sort by first name
        sortDirection: 'asc', // Ascending order
      };

      const response = await peopleApi.filterPersons(filterParams);

      // Check if response has the expected structure
      if (response && response.data) {
        setEmployees(response.data);

        // Update pagination info if available
        if (response.meta) {
          setTotalPages(response.meta.totalPages);
          setCurrentPage(response.meta.currentPage);
        }
      } else {
        console.error('Unexpected response format:', response);
        toast.error('Failed to parse employee data');
      }
    } catch (error) {
      console.error('Error fetching employees:', error);
      toast.error('Failed to load employees');
    } finally {
      setIsFetching(false);
    }
  };

  // Handle delete employee
  const handleDeleteEmployee = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await peopleApi.deletePerson(id);
        toast.success('Employee deleted successfully');
        fetchEmployees(); // Refresh the list
      } catch (error) {
        console.error('Error deleting employee:', error);
        toast.error('Failed to delete employee');
      }
    }
  };

  // Load saved personId from localStorage on initial render
  useEffect(() => {
    // Only run in browser environment
    if (typeof window !== 'undefined') {
      // Load personId
      const savedPersonId = localStorage.getItem('potta_personId');
      if (savedPersonId) {
        setPersonId(savedPersonId);
      }

      // Load last active step
      const savedActiveStep = localStorage.getItem('potta_activeStep');
      if (savedActiveStep) {
        setActive(savedActiveStep);
      }

      // Try to load saved form data if available
      try {
        const savedBaseInfo = localStorage.getItem('potta_baseInfo');
        if (savedBaseInfo) {
          setBaseInfo(JSON.parse(savedBaseInfo));
        }

        const savedAddress = localStorage.getItem('potta_address');
        if (savedAddress) {
          setAddress(JSON.parse(savedAddress));
        }

        const savedBankAccount = localStorage.getItem('potta_bankAccount');
        if (savedBankAccount) {
          setBankAccount(JSON.parse(savedBankAccount));
        }

        const savedCompensation = localStorage.getItem('potta_compensation');
        if (savedCompensation) {
          setCompensation(JSON.parse(savedCompensation));
        }

        const savedSchedule = localStorage.getItem('potta_schedule');
        if (savedSchedule) {
          setSchedule(JSON.parse(savedSchedule));
        }

        const savedBenefit = localStorage.getItem('potta_benefit');
        if (savedBenefit) {
          setBenefit(JSON.parse(savedBenefit));
        }

        const savedTaxInfo = localStorage.getItem('potta_taxInfo');
        if (savedTaxInfo) {
          setTaxInfo(JSON.parse(savedTaxInfo));
        }
      } catch (error) {
        console.error('Error loading saved form data:', error);
      }
    }
  }, []);

  // Fetch person data whenever personId changes or when navigating back to previous steps
  useEffect(() => {
    if (personId && active === 'ba') {
      fetchBankAccountData();
    }
  }, [personId, active]);

  // Fetch bank account data
  const fetchBankAccountData = async () => {
    if (!personId) return;

    try {
      console.log('Fetching bank accounts for person:', personId);
      const bankAccountsResponse = await peopleApi.getBankAccounts(personId);
      console.log('Fetched bank accounts:', bankAccountsResponse);

      // Check if the response has a data property (pagination structure)
      const bankAccounts = bankAccountsResponse.data || bankAccountsResponse;

      if (
        bankAccounts &&
        Array.isArray(bankAccounts) &&
        bankAccounts.length > 0
      ) {
        // Find the primary account or use the first one
        const primaryAccount =
          bankAccounts.find((acc: any) => acc.is_primary) || bankAccounts[0];

        const newBankAccount = {
          person_id: personId,
          account_holder_name:
            primaryAccount.account_holder_name ||
            (personData
              ? `${personData.firstName} ${personData.lastName}`
              : ''),
          bank_name: primaryAccount.bank_name || '',
          account_number: primaryAccount.account_number || '',
          routing_number: primaryAccount.routing_number || '',
          currency: primaryAccount.currency || 'USD',
          account_type: primaryAccount.account_type || 'Checking',
          is_primary: primaryAccount.is_primary || true,
          country:
            primaryAccount.country || personData?.address?.country || 'US',
          verified: primaryAccount.verified || false,
        };

        console.log('Setting bank account data:', newBankAccount);
        setBankAccount(newBankAccount);
      } else {
        // If no bank accounts found, create an empty one with person data
        const emptyBankAccount = {
          person_id: personId,
          account_holder_name: personData
            ? `${personData.firstName} ${personData.lastName}`
            : '',
          bank_name: '',
          account_number: '',
          routing_number: '',
          currency: 'USD',
          account_type: 'Checking',
          is_primary: true,
          country: personData?.address?.country || 'US',
          verified: false,
        };
        setBankAccount(emptyBankAccount);
      }
    } catch (error) {
      console.error('Error fetching bank accounts:', error);
      // Create a default bank account object
      const defaultBankAccount = {
        person_id: personId,
        account_holder_name: personData
          ? `${personData.firstName} ${personData.lastName}`
          : '',
        bank_name: '',
        account_number: '',
        routing_number: '',
        currency: 'USD',
        account_type: 'Checking',
        is_primary: true,
        country: personData?.address?.country || 'US',
        verified: false,
      };
      setBankAccount(defaultBankAccount);
    }
  };

  // Save active step to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('potta_activeStep', active);
  }, [active]);

  // Function to collect data from each component
  const handleBaseInfoChange = (data: BaseInfoPayload) => {
    console.log('BaseInfo changed:', data);
    setBaseInfo(data);
    // Save to localStorage
    localStorage.setItem('potta_baseInfo', JSON.stringify(data));
  };

  const handleAddressChange = (data: AddressPayload) => {
    console.log('Address changed:', data);
    setAddress(data);
    // Save to localStorage
    localStorage.setItem('potta_address', JSON.stringify(data));
  };

  const handleBankAccountChange = (data: BankAccountPayload) => {
    setBankAccount(data);
    // Save to localStorage
    localStorage.setItem('potta_bankAccount', JSON.stringify(data));
  };

  const handleCompensationChange = (data: CompensationPayload) => {
    setCompensation(data);
    // Save to localStorage
    localStorage.setItem('potta_compensation', JSON.stringify(data));
  };

  const handleScheduleChange = (data: SchedulePayload) => {
    setSchedule(data);
    // Save to localStorage
    localStorage.setItem('potta_schedule', JSON.stringify(data));
  };

  const handleBenefitChange = (data: BenefitPayload) => {
    setBenefit(data);
    // Save to localStorage
    localStorage.setItem('potta_benefit', JSON.stringify(data));
  };

  const handleTaxInfoChange = (data: TaxInfoPayload) => {
    setTaxInfo(data);
    // Save to localStorage
    localStorage.setItem('potta_taxInfo', JSON.stringify(data));
  };

  // Clear all saved data
  const clearSavedData = () => {
    localStorage.removeItem('potta_personId');
    localStorage.removeItem('potta_baseInfo');
    localStorage.removeItem('potta_address');
    localStorage.removeItem('potta_bankAccount');
    localStorage.removeItem('potta_compensation');
    localStorage.removeItem('potta_schedule');
    localStorage.removeItem('potta_benefit');
    localStorage.removeItem('potta_taxInfo');
    localStorage.removeItem('potta_activeStep');

    // Reset all state
    setPersonId(null);
    setPersonData(null);
    setBaseInfo(null);
    setAddress(null);
    setBankAccount(null);
    setCompensation(null);
    setSchedule(null);
    setBenefit(null);
    setTaxInfo(null);
    setActive('ebi');
    setViewMode(false);
  };

  // Format data according to the required payload structure
  const formatPersonPayload = (): PersonPayload | null => {
    if (!baseInfo || !address) {
      return null;
    }

    const payload = {
      firstName: baseInfo.firstName,
      lastName: baseInfo.lastName,
      email: baseInfo.email,
      phone: baseInfo.phoneNumber,
      gender: baseInfo.gender.toLowerCase(),
      date_of_birth: baseInfo.birthday,
      employment_type: baseInfo.employmentType,
      start_date: baseInfo.employmentDate,
      end_date: null,
      marital_status: baseInfo.maritalStatus,
      payScheduleId: schedule?.payScheduleId,
      tax_payer_number: baseInfo.taxPayerNumber,
      national_identification_number: baseInfo.nationalId,
      roleId: baseInfo.roleId, // Use the selected roleId
      matricule: baseInfo.matricule,
      isActive: true,
      address: {
        address: address.address,
        city: address.city,
        state: address.state,
        country: address.country,
        postalCode: address.postalCode,
        latitude: address.latitude || 0,
        longitude: address.longitude || 0,
      },
      // Include additional data if needed for the complete person creation
      // taxInfo: taxInfo || undefined,
    };

    console.log('Formatted person payload:', payload);
    return payload;
  };

  // Create person after address step
  const createPerson = async () => {
    if (!baseInfo || !address) {
      toast.error('Missing required information');
      return null;
    }

    const loadingToastId = toast.loading('Creating employee...');
    try {
      const payload = formatPersonPayload();
      if (!payload) {
        toast.error('Invalid form data');
        return null;
      }

      console.log('Sending payload to create person:', payload);
      const result = await peopleApi.createPerson(payload);
      console.log('Person created successfully:', result);

      // Save personId to state and localStorage
      setPersonId(result.uuid);
      localStorage.setItem('potta_personId', result.uuid);

      toast.success('Employee created successfully!');
      return result.uuid;
    } catch (error) {
      console.error('Error creating person:', error);
      toast.error('Failed to create employee. Please try again.');
      return null;
    } finally {
      toast.dismiss(loadingToastId);
    }
  };

  // Update existing person
  const updatePerson = async () => {
    if (!personId || !baseInfo || !address) {
      toast.error('Missing required information');
      return false;
    }

    const loadingToastId = toast.loading('Updating employee...');
    try {
      const payload = formatPersonPayload();
      if (!payload) {
        toast.error('Invalid form data');
        return false;
      }

      console.log('Sending payload to update person:', payload);
      await peopleApi.updatePerson(personId, payload);
      toast.success('Employee updated successfully!');
      return true;
    } catch (error) {
      console.error('Error updating person:', error);
      toast.error('Failed to update employee. Please try again.');
      return false;
    } finally {
      toast.dismiss(loadingToastId);
    }
  };

  // Handle proceed button click
  const handleProceed = async () => {
    if (viewMode) {
      // In view mode, just navigate between tabs
      switch (active) {
        case 'ebi':
          setActive('el');
          break;
        case 'el':
          setActive('ba');
          break;
        case 'ba':
          setActive('c');
          break;
        case 'c':
          setActive('ps');
          break;
        case 'ps':
          setActive('bad');
          break;
        case 'bad':
          setActive('eti');
          break;
        case 'eti':
          handleCloseModal();
          break;
      }
      return;
    }

    setIsLoading(true);

    try {
      switch (active) {
        case 'ebi':
          // Validate base info
          if (!baseInfo) {
            toast.error('Please complete the employee base information');
            break;
          }
          // Just move to next step - we'll collect and validate data when needed
          setActive('el');
          break;

        case 'el':
          // Validate address info
          if (!address) {
            toast.error('Please complete the employee location information');
            break;
          }

          // Create person after address step is completed
          if (!personId) {
            const newPersonId = await createPerson();
            if (!newPersonId) {
              // If person creation failed, don't proceed
              break;
            }
          } else {
            // Update existing person
            const updateSuccess = await updatePerson();
            if (!updateSuccess) {
              // If update failed, don't proceed
              break;
            }
          }

          // Move to next step with person created
          setActive('ba');
          break;

        // In the 'ba' case of handleProceed function
        case 'ba':
          // Validate bank account info
          if (!bankAccount) {
            toast.error('Please complete the bank account information');
            break;
          }

          // Create or update bank account
          try {
            if (personId) {
              const bankAccountData = {
                ...bankAccount,
                person_id: personId,
              };

              // Remove country_code if it exists
              if ('country_code' in bankAccountData) {
                delete bankAccountData.country_code;
              }

              console.log(
                'Creating/updating bank account with data:',
                bankAccountData
              );
              await peopleApi.createBankAccount(bankAccountData);
              toast.success('Bank account saved successfully!');
            } else {
              toast.error('Person ID is missing. Cannot save bank account.');
              break;
            }
          } catch (error) {
            console.error('Error saving bank account:', error);
            toast.error('Failed to save bank account. Please try again.');
            break;
          }

          // Move to next step
          setActive('c');
          break;

        case 'c':
          // Compensation is handled by the component itself
          // Just move to next step
          setActive('ps');
          break;

        case 'ps':
          // Payroll schedule is handled by the component itself
          // Just move to next step
          setActive('bad');
          break;

        case 'bad':
          // Benefits are handled by the component itself
          // Just move to next step
          setActive('eti');
          break;

        case 'eti':
          // Final step - update with tax info
          if (!taxInfo) {
            toast.error('Please complete the tax information');
            break;
          }

          // Update person with tax info
          if (personId) {
            const updateSuccess = await updatePerson();
            if (updateSuccess) {
              toast.success('Employee setup completed!');
              // Clear all data from localStorage when complete
              clearSavedData();
              // Close the modal and refresh the employee list
              handleCloseModal();
              fetchEmployees();
            }
          } else {
            toast.error('Person ID is missing. Cannot complete setup.');
          }
          break;
      }
    } catch (error) {
      console.error('Error in form submission:', error);
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle tab click with data fetching
  const handleTabClick = (tab: string) => {
    // Only allow navigation to completed steps or the next step
    if (personId || tab === 'ebi' || tab === 'el') {
      setActive(tab);
    } else {
      toast.error('Please complete previous steps first');
    }
  };

  // Determine if we should show the buttons based on the current active tab
  const shouldShowButtons = () => {
    // Hide buttons for compensation, payroll schedule, and benefits
    return !['c', 'ps', 'bad'].includes(active);
  };

  // Handle new employee button click
  const handleOpenModal = () => {
    setModalAnimation('animate-slide-in-top');
    setShowModal(true);
  };

  // Handle new employee button click
  const handleNewEmployee = () => {
    clearSavedData();
    handleOpenModal();
  };

  // Close the modal with animation
  const handleCloseModal = () => {
    if (
      viewMode ||
      window.confirm(
        'Are you sure you want to close? Any unsaved changes will be lost.'
      )
    ) {
      setModalAnimation('animate-slide-out-top');
      // Wait for animation to complete before hiding modal
      setTimeout(() => {
        setShowModal(false);
        clearSavedData();
      }, 300); // Match this with the CSS animation duration
    }
  };

  const closeModalWithoutConfirmation = () => {
    setModalAnimation('animate-slide-out-top');
    // Wait for animation to complete before hiding modal
    setTimeout(() => {
      setShowModal(false);
      clearSavedData();
    }, 300); // Match this with the CSS animation duration
  };

  // Handle page change for pagination
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <RootLayout>
      <div className="w-full p-6 pl-12">
        <div className="flex justify-between items-center mb-6">
          <Search placeholder="Search People" />
          <Button
            text="New Employee"
            type="button"
            onClick={handleNewEmployee}
          />
        </div>

        {/* Table with loading state */}
        <div className="bg-white">
          {isFetching && !showModal ? (
            <div className="p-8">
              <CustomLoader />
            </div>
          ) : (
            <MyTable
              columns={columns}
              data={employees}
              ExpandableComponent={null}
              expanded
              pagination={employees.length > 9}
              paginationTotalRows={totalPages * pageSize}
              onChangePage={handlePageChange}
              noDataComponent={
                <div className="p-8 text-center">
                  <p className="text-gray-500 text-lg">No employees found</p>
                  <p className="text-gray-400 mt-2">
                    Add a new employee to get started
                  </p>
                </div>
              }
            />
          )}
        </div>
      </div>

      {/* Modal Overlay */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[999] flex flex-col items-center">
          <div
            className={`bg-white w-full relative h-screen overflow-none ${modalAnimation}`}
            style={{ transform: 'translate3d(0, 0, 0)' }} // Force hardware acceleration
          >
            <div className="sticky top-0 bg-white p-4 border-b flex justify-between items-center z-10">
              <h2 className="text-xl font-bold">
                {viewMode
                  ? 'View Employee'
                  : personId
                  ? 'Edit Employee'
                  : 'New Employee'}
                {personData && (
                  <span className="ml-2 text-gray-500 text-base">
                    {personData.firstName} {personData.lastName}
                  </span>
                )}
              </h2>
              <button
                onClick={closeModalWithoutConfirmation}
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

            <div className="w-full flex px-4">
              <div className="w-[16%] pt-10 item-left space-y-7 border-r">
                <div className="" onClick={() => handleTabClick('ebi')}>
                  <p
                    className={`whitespace-nowrap ${
                      active == 'ebi' && 'text-green-700 font-semibold'
                    } cursor-pointer text-left`}
                  >
                    Employee Base Information
                  </p>
                </div>
                <div className="" onClick={() => handleTabClick('el')}>
                  <p
                    className={`whitespace-nowrap ${
                      active == 'el' && 'text-green-700 font-semibold'
                    } cursor-pointer text-left`}
                  >
                    Employee Location
                  </p>
                </div>
                <div className="" onClick={() => handleTabClick('ba')}>
                  <p
                    className={`whitespace-nowrap ${
                      active == 'ba' && 'text-green-700 font-semibold'
                    } cursor-pointer text-left ${!personId && 'opacity-50'}`}
                  >
                    Bank Account
                  </p>
                </div>
                <div className="" onClick={() => handleTabClick('c')}>
                  <p
                    className={`whitespace-nowrap ${
                      active == 'c' && 'text-green-700 font-semibold'
                    } cursor-pointer text-left ${!personId && 'opacity-50'}`}
                  >
                    Compensation
                  </p>
                </div>
                <div className="" onClick={() => handleTabClick('ps')}>
                  <p
                    className={`whitespace-nowrap ${
                      active == 'ps' && 'text-green-700 font-semibold'
                    } cursor-pointer text-left ${!personId && 'opacity-50'}`}
                  >
                    PayCycle{' '}
                  </p>
                </div>
                <div className="" onClick={() => handleTabClick('bad')}>
                  <p
                    className={`whitespace-nowrap ${
                      active == 'bad' && 'text-green-700 font-semibold'
                    } cursor-pointer text-left ${!personId && 'opacity-50'}`}
                  >
                    Benefits
                  </p>
                </div>
              </div>
              <div className="w-full overflow-y-auto h-[calc(100vh-68px)] pt-0 relative">
                {isFetching && (
                  <div className="fixed z-[9999] backdrop-blur-sm top-0 left-0 h-screen w-screen grid place-content-center">
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
                      <p className="mt-4 text-gray-600">
                        Loading employee data...
                      </p>
                    </div>
                  </div>
                )}

                {!isFetching && (
                  <div className="w-full overflow-auto">
                    {active === 'ps' && (
                      <Schedule
                        key={`schedule-${formKey}`}
                        onChange={handleScheduleChange}
                        initialData={schedule}
                        personId={personId || ''}
                        onComplete={() => setActive('bad')}
                        readOnly={viewMode}
                      />
                    )}
                    {active === 'ebi' && (
                      <BaseInfo
                        key={`baseInfo-${formKey}`}
                        onChange={handleBaseInfoChange}
                        initialData={baseInfo}
                        readOnly={viewMode}
                      />
                    )}
                    {active === 'el' && (
                      <Address
                        key={`address-${formKey}`}
                        onChange={handleAddressChange}
                        initialData={address}
                        readOnly={viewMode}
                      />
                    )}
                    {active === 'ba' && (
                      <BankAccount
                        key={`bankAccount-${formKey}`}
                        personId={personId || ''}
                        onChange={handleBankAccountChange}
                        initialData={bankAccount}
                        readOnly={viewMode}
                      />
                    )}
                    {active === 'c' && (
                      <Compensation
                        key={`compensation-${formKey}`}
                        personId={personId || ''}
                        onChange={handleCompensationChange}
                        initialData={compensation}
                        onComplete={() => setActive('ps')}
                        readOnly={viewMode}
                      />
                    )}

                    {active === 'bad' && (
                      <Benefit
                        key={`benefit-${formKey}`}
                        personId={personId || ''}
                        onComplete={() => {
                          clearSavedData();
                          closeModalWithoutConfirmation();
                          fetchEmployees();
                        }}
                        readOnly={viewMode}
                      />
                    )}
                  </div>
                )}

                {/* Only show navigation buttons for stages that need them */}
                {shouldShowButtons() && !isFetching && (
                  <div className="w-full p-2 flex justify-between mt-5 px-14 mb-6">
                    {/* Show different buttons based on view mode */}
                    {viewMode ? (
                      <>
                        <Button
                          text="Close"
                          type="button"
                          onClick={closeModalWithoutConfirmation}
                          className="bg-gray-500 hover:bg-gray-600"
                        />
                        <Button
                          text={active === 'eti' ? 'Done' : 'Next'}
                          type="button"
                          onClick={handleProceed}
                        />
                      </>
                    ) : (
                      <>
                        <Button
                          text="Reset Form"
                          type="button"
                          onClick={() => {
                            if (
                              window.confirm(
                                'Are you sure you want to reset the form? All data will be lost.'
                              )
                            ) {
                              clearSavedData();
                            }
                          }}
                          className="bg-red-500 hover:bg-red-600"
                        />
                        <Button
                          text={
                            isLoading
                              ? 'Processing...'
                              : active === 'el' && !personId
                              ? 'Create Employee'
                              : active === 'eti'
                              ? 'Complete Setup'
                              : 'Proceed'
                          }
                          type={'submit'}
                          onClick={handleProceed}
                          disabled={isLoading}
                        />
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add these animations to your global CSS or in a style tag */}
      <style jsx global>{`
        @keyframes slideInTop {
          from {
            transform: translateY(-100%);
          }
          to {
            transform: translateY(0);
          }
        }

        @keyframes slideOutTop {
          from {
            transform: translateY(0);
          }
          to {
            transform: translateY(-100%);
          }
        }

        .animate-slide-in-top {
          animation: slideInTop 0.3s ease-out forwards;
        }

        .animate-slide-out-top {
          animation: slideOutTop 0.3s ease-in forwards;
        }
      `}</style>
    </RootLayout>
  );
};

export default People;
