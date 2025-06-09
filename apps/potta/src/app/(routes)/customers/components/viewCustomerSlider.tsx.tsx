'use client';
import React from 'react';
import Slider from '@potta/components/slideover';
import Text from '@potta/components/textDisplay';
import useGetOneCustomer from '../hooks/useGetOneCustomer';

import { PhoneFlag } from './table';
import { useContext, useEffect, useState } from 'react';
import { ContextData } from '@potta/components/context';

interface CustomerDetailsProps {
  open?: boolean;
  customerId: string;
  setOpen?: (open: boolean) => void;
}
const ViewCustomerSlider: React.FC<CustomerDetailsProps> = ({
  customerId,
  open: controlledOpen,
  setOpen: setControlledOpen,
}) => {
  const [localOpen, setLocalOpen] = useState(false);

  const { data, isLoading, error, refetch } = useGetOneCustomer(customerId);

  const isOpen = controlledOpen ?? localOpen;
  const setIsOpen = setControlledOpen ?? setLocalOpen;

  useEffect(() => {
    if (isOpen && customerId) {
      refetch();
    }
  }, [customerId, refetch, isOpen]);
  return (
    <Slider
      edit={false}
      open={isOpen}
      setOpen={setIsOpen}
      title={'Vendor Details'}
      buttonText="view vendor"
    >
      {isLoading && (
        <div className="flex justify-center items-center py-10 h-screen">
          Loading
        </div>
      )}

      {error && (
        <p className="text-red-600 text-center">
          Error fetching customer details: {error.message}
        </p>
      )}

      {!data ||
        (Object.keys(data).length === 0 && (
          <p className="text-gray-500 text-center">
            No customer data available.
          </p>
        ))}

      {data && (
        <div className="relative h-screen w-full max-w-4xl">
          {/* Header */}
          <div className="w-full grid grid-cols-2 gap-3">
            <Text
              name="Name"
              value={`${data.firstName} ${data.lastName}`}
              height
            />
            <Text name="Type" value={data.type} height />
          </div>
          <div className="w-full grid grid-cols-2 gap-3">
            <Text name="Email" value={data.email} height />
            <div className="">
              <span className="mb-3 text-gray-900 font-bold">Phone Number</span>
              <div className={`w-full py-1.5' px-4 mt-2`}>
                {data.phone && <PhoneFlag phoneNumber={`${data.phone}`} />}
              </div>
            </div>
          </div>
          <div className="w-full grid grid-cols-2 gap-3">
            <Text name="Contact Person" value={data.contactPerson} height />
            <Text name="Credit Limit" value={data.creditLimit} height />
          </div>
          <div className="w-full grid grid-cols-2 gap-3">
            <Text name="Status" value={data.status} height />
            <Text name="TaxId" value={data.taxId} height />
          </div>

          <div className="w-full grid grid-cols-2 gap-3">
            <Text name="Created At" value={data.createdAt} height />
          </div>
          <hr className="my-8" />

          <div className="w-full grid grid-cols-2 gap-3">
            <Text name="Address" value={data.address.address} height />
          </div>
          <div className="w-full grid grid-cols-2 gap-3">
            <Text name="City" value={data.address.city} height />
            <Text name="Postal Code" value={data.address.postalCode} height />
          </div>
          <div className="w-full grid grid-cols-2 gap-3">
            <Text name="State" value={data.address.state} height />
            <Text name="Country" value={data.address.country} height />
          </div>
          <div className="w-full grid grid-cols-2 gap-3">
            <Text name="Latitude" value={data.address.latitude} height />
            <Text name="Longitude" value={data.address.longitude} height />
          </div>
        </div>
      )}
    </Slider>
  );
};

export default ViewCustomerSlider;
