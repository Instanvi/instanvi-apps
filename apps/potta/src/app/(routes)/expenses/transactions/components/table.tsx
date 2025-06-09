/* eslint-disable @next/next/no-img-element */
// src/components/PaymentRequestDataTableWrapper.tsx (New File)
'use client';

import React from 'react';

import MyTable from '@potta/components/table';
import { cn } from '@potta/lib/utils';
import {
  PaymentMethod,
  PaymentRequest,
} from '../../budgets/details/utils/types';
import { paymentRequestColumn } from './columns';

interface PaymentRequestDataTableWrapperProps {
  requests: PaymentRequest[];
  isLoading?: boolean;
}

export const PaymentMethodIcon: React.FC<{ method: PaymentMethod }> = ({
  method,
}) => {
  const IconComponent = method.iconComponent;
  const sizeClass = 'h-5 w-5';

  return (
    <div
      className={cn(
        'h-7 w-7 rounded-full flex items-center justify-center',
        method.bgColorClass || 'bg-gray-100'
      )}
    >
      {method.iconUrl ? (
        <img
          src={method.iconUrl}
          alt={method.name}
          className="h-5 w-5 object-contain"
        />
      ) : IconComponent ? (
        <IconComponent
          className={cn(sizeClass, method.iconColorClass || 'text-gray-600')}
        />
      ) : (
        <span className="text-xs font-medium">?</span>
      )}
    </div>
  );
};

// Helper for currency format (same as before)
export const formatTableCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// --- Main Wrapper Component ---

export function PaymentRequestDataTableWrapper({
  requests,
  isLoading = false,
}: PaymentRequestDataTableWrapperProps) {
  const newColumn = React.useMemo(() => paymentRequestColumn(), []);

  return (
    <MyTable
      columns={newColumn}
      data={requests}
      selectable={true} // Enable checkboxes as per design
      pagination={false} // Disable pagination as per design
      pending={isLoading} // Pass loading state
      color={false} // Use the default light header color
      size={false} // Use the default size
      expanded={true} // Not needed
      ExpandableComponent={null} // Not needed
      minHeight="600px"
      // --- Add these if/when implementing server-side pagination ---
      // paginationServer={true}
      // paginationTotalRows={totalRowCount}
      // onChangePage={handlePageChange}
      // onChangeRowsPerPage={handlePerRowsChange}
    />
  );
}
