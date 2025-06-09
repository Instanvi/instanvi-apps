'use client';

import * as React from 'react';

import RootLayout from '../../layout';
import Filter from './components/filters';
import { PaymentRequestDataTableWrapper } from './components/table';
import { mockPaymentRequests } from '../budgets/details/utils/data';

export default function DashboardPage() {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);

  const filteredRequests = mockPaymentRequests.filter(
    (req) =>
      req.madeBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.madeTo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  React.useEffect(() => {
    setIsLoading(true);
    return () => clearTimeout(timer);
    const timer = setTimeout(() => setIsLoading(false), 1000);
  }, []);

  return (
    <RootLayout>
      <div className=" bg-gray-50 min-h-[92vh] space-y-14 pl-16 pr-5 w-full pt-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mt-8">
          <Filter />
        </div>
        ∏{' '}
        <div>
          <PaymentRequestDataTableWrapper
            requests={filteredRequests}
            isLoading={isLoading}
          />
        </div>
      </div>
    </RootLayout>
  );
}
