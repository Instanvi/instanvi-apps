'use client';
import Tax from './tax';
import React from 'react';
import Address from './address';
import toast from 'react-hot-toast';
import Button from '@potta/components/button';
import Input from '@potta/components/input';
import Select from '@potta/components/select';
import Slider from '@potta/components/slideover';
import useCreateCustomer from '../hooks/useCreateCustomer';

import { format } from 'date-fns';
import { cn } from '@potta/lib/utils';
import { CalendarIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { PhoneInput } from '@potta/components/phoneInput';
import { Button as ShadcnButton } from '@potta/components/shadcn/button';
import { Calendar } from '@potta/components/shadcn/calendar';
import { CustomerPayload, customerSchema } from '../utils/validations';
// Import shadcn date picker components
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@potta/components/shadcn/popover';

interface CustomerCreateProps {
  open?: boolean;
  setOpen?: (open: boolean) => void;
}

interface PhoneMetadata {
  rawInput: string;
  countryCode: string;
  formattedValue: string;
}

const SliderCustomer: React.FC<CustomerCreateProps> = ({
  open: controlledOpen,
  setOpen: setControlledOpen,
}) => {
  const [localOpen, setLocalOpen] = useState(false);
  const [tabs, setTabs] = useState<string>('Address');
  const [phoneMetadata, setPhoneMetadata] = useState<PhoneMetadata>({
    rawInput: '',
    formattedValue: '',
    countryCode: '+237',
  });

  const isOpen = controlledOpen ?? localOpen;
  const setIsOpen = setControlledOpen ?? setLocalOpen;
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<CustomerPayload>({
    resolver: yupResolver(customerSchema),
    defaultValues: {
      taxId: '',
      phone: '',
      email: '',
      lastName: '',
      firstName: '',
      type: undefined,
      contactPerson: '',
      address: {
        city: '',
        state: '',
        address: '',
        country: '',
        latitude: 0,
        longitude: 0,
        postalCode: '',
      },
      creditLimit: 0,
      gender: undefined,
      date_of_birth: undefined, // Add default value for dateOfBirth
    },
  });

  const CustomerTypeEnum = [
    { value: 'individual', label: 'Individual' },
    { value: 'company', label: 'Company' },
  ];

  const CustomerGenderEnum = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'other', label: 'Other' },
  ];

  const mutation = useCreateCustomer();
  const onSubmit = (data: CustomerPayload) => {
    console.log('Submitted Data:', data);
    mutation.mutate(data, {
      onSuccess: () => {
        toast.success('Customer created successfully!');
        reset();
        setIsOpen(false);
      },
      onError: (error) => {
        toast.error('Failed to create Customer');
      },
    });
  };

  // Handle phone number changes with the new API
  const handlePhoneChange = (
    combinedValue: string,
    metadata: PhoneMetadata
  ) => {
    // Store the complete metadata for future reference
    setPhoneMetadata(metadata);

    // Set the combined value (country code + phone number) to the form
    setValue('phone', combinedValue);
  };

  // Reset form and metadata when the form is closed
  useEffect(() => {
    if (!isOpen) {
      reset();
      setPhoneMetadata({
        formattedValue: '',
        countryCode: '+237',
        rawInput: '',
      });
    }
  }, [isOpen, reset]);

  return (
    <Slider
      open={isOpen} // Use controlled or local state
      setOpen={setIsOpen} // Use controlled or local setter
      edit={false}
      title={'Create Customer'}
      buttonText="customer"
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="relative h-screen w-full max-w-4xl "
      >
        <div className="w-full grid grid-cols-2 gap-3">
          <div>
            <Input
              label="First Name"
              type="text"
              name="firstName"
              placeholder="Enter customer First Name"
              register={register}
              errors={errors.firstName}
              required
            />
          </div>
          <div>
            <Input
              label="Last Name"
              type="text"
              name="lastName"
              placeholder="Enter customer Last Name"
              register={register}
              errors={errors.lastName}
              required
            />
          </div>
        </div>
        <div className="w-full grid my-5 grid-cols-2 gap-3">
          <div>
            <Input
              label="Contact Name"
              type="text"
              name="contactPerson"
              placeholder="Enter Contact Name"
              register={register}
              errors={errors.contactPerson}
            />
          </div>
          <div>
            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <Select
                  options={CustomerTypeEnum}
                  selectedValue={field.value}
                  onChange={field.onChange}
                  bg="bg-white"
                  name="Select Customer Type"
                  label="Type"
                  required
                />
              )}
            />
            {errors.type && (
              <small className="text-red-500">{errors.type.message}</small>
            )}
          </div>
        </div>
        <div className="w-full grid my-5 grid-cols-2 gap-3">
          <div>
            <Input
              label="Credit Limit"
              type="number"
              name="creditLimit"
              placeholder="Enter Credit limit"
              register={register}
              errors={errors.creditLimit}
            />
          </div>
          <div>
            <Controller
              name="gender"
              control={control}
              render={({ field }) => (
                <Select
                  options={CustomerGenderEnum}
                  selectedValue={field.value}
                  onChange={field.onChange}
                  bg="bg-white"
                  name="Select Customer Gender"
                  label="Gender"
                  required
                />
              )}
            />
            {errors.gender && (
              <small className="text-red-500">{errors.gender.message}</small>
            )}
          </div>
        </div>
        {/* Date of Birth Field */}
        <div className="w-full mb-5">
          <div>
            <label className="block text-sm font-medium mb-1">
              Date of Birth
            </label>
            <Controller
              control={control}
              name="date_of_birth"
              render={({ field }) => (
                <Popover>
                  <PopoverTrigger asChild>
                    <ShadcnButton
                      variant="outline"
                      className={cn(
                        'w-1/2 py-5  justify-start text-left font-normal',
                        !field.value && 'text-muted-foreground'
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {field.value ? (
                        format(field.value, 'PPP')
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </ShadcnButton>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      initialFocus
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                    />
                  </PopoverContent>
                </Popover>
              )}
            />
            {errors.date_of_birth && (
              <small className="text-red-500">
                {errors.date_of_birth.message}
              </small>
            )}
          </div>
        </div>
        <hr />
        <div className="mt-2">
          <h1 className="text-xl">Contact Information </h1>
          <div className="w-full grid mt-7 grid-cols-2 gap-3">
            <div>
              {/* Phone Input Component with correct props */}
              <Controller
                name="phone"
                control={control}
                render={({ field }) => (
                  <>
                    <PhoneInput
                      whatsapp={false}
                      label="Phone Number"
                      onChange={handlePhoneChange}
                      placeholder="Enter phone number"
                      value={phoneMetadata.formattedValue} // Use the formatted value from metadata
                      countryCode={phoneMetadata.countryCode} // Use the country code from metadata
                    />
                    {errors.phone && (
                      <small className="text-red-500">
                        {errors.phone.message}
                      </small>
                    )}
                  </>
                )}
              />
            </div>
            <div>
              <Input
                type={'text'}
                name={'email'}
                label={'Email'}
                register={register}
                errors={errors.email}
                placeholder="abcdfg@abc.com"
              />
            </div>
          </div>
        </div>
        <div className="mt-5">
          <div className="flex w-fit bg-green-100  mt-7">
            <div
              onClick={() => setTabs('Address')}
              className={`px-4 py-2.5 duration-500 ease-in-out ${
                tabs == 'Address' &&
                'border-b  border-green-500 text-green-500 font-thin '
              } cursor-pointer `}
            >
              <p>Address</p>
            </div>

            <div
              onClick={() => setTabs('Tax')}
              className={`px-4 py-2.5 duration-500 ease-in-out ${
                tabs == 'Tax' &&
                'border-b border-green-500 text-green-500 font-thin '
              } cursor-pointer `}
            >
              <p>Tax ID</p>
            </div>
          </div>
          <div className="mt-5 pb-20 duration-500 ease-in-out">
            {tabs == 'Address' && (
              <Address register={register} errors={errors?.address ?? {}} />
            )}
            {tabs == 'Tax' && <Tax register={register} errors={errors.taxId} />}
          </div>
        </div>
        <div className="flex-grow" /> {/* This div takes up remaining space */}
        <div className="text-center md:text-right  md:flex  space-x-4 fixed bottom-0 left-0 right-0 justify-center bg-white p-4">
          <div className="flex gap-2 w-full max-w-4xl justify-between">
            <Button
              text="Cancel"
              type="button"
              theme="danger"
              onClick={() => setIsOpen(false)}
            />
            <Button
              type={'submit'}
              text={'Add Customer'}
              isLoading={mutation.isPending}
            />
          </div>
        </div>
      </form>
    </Slider>
  );
};

export default SliderCustomer;
