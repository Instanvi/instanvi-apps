import { Icon } from '@iconify/react';
import {
  PaymentMethod,
  PaymentRequest,
} from '../../budgets/details/utils/types';
import { formatTableCurrency, PaymentMethodIcon } from './table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@potta/components/shadcn/dropdown';
import { MoreHorizontal } from 'lucide-react';
import { Button } from '@potta/components/shadcn/button';

export const paymentRequestColumn = () => [
  {
    name: 'Ref',
    selector: (row: PaymentRequest) =>
      row.ref === 'Today' ? row.date : row.ref, // Use date if ref is 'Today' for sorting potentially
    sortable: true,
    cell: (row: PaymentRequest) =>
      row.ref === 'Today' ? (
        <span className="italic text-gray-600">Today</span>
      ) : (
        row.date
      ),
    minWidth: '100px',
  },
  {
    name: 'Made By',
    selector: (row: PaymentRequest) => row.madeBy,
    sortable: true,
    cell: (row: PaymentRequest) => (
      <span className="font-semibold">{row.madeBy}</span>
    ),
    minWidth: '120px',
  },
  {
    name: 'Made To',
    selector: (row: PaymentRequest) => row.madeTo,
    sortable: true,
    minWidth: '100px',
  },
  {
    name: 'Category',
    selector: (row: PaymentRequest) => row.category,
    sortable: true,
    minWidth: '100px',
  },
  {
    name: 'Amount',
    selector: (row: PaymentRequest) => row.amount,
    sortable: true,

    cell: (row: PaymentRequest) => (
      <span className="font-medium">
        {row.currency} {formatTableCurrency(row.amount)}
      </span>
    ),
    minWidth: '100px',
  },
  {
    name: 'Method',
    cell: (row: PaymentRequest) => <PaymentMethodIcon method={row.method} />,
    center: true,
    width: '100px', // Fixed width for icon column
  },

  {
    name: 'Request Status',
    center: true,
    cell: (row: PaymentRequest) => (
      <div className="border-r pr-8 border-black">
        <div className="flex items-center gap-3  w-fit px-3 py-0.5 border border-green-500 bg-green-50 text-green-700">
          <div className="flex items-center justify-center text-white bg-green-700 rounded-full size-4">
            <Icon icon="material-symbols:check" width="20" height="20" />
          </div>
          Approved
        </div>
      </div>
    ),
    minWidth: '100px',
  },
  {
    name: 'Actions',
    button: true, // Important for click events on elements within the cell
    allowOverflow: true, // Important for dropdown menus
    ignoreRowClick: true, // Prevent row click when clicking the button/menu
    width: '100px', // Fixed width
    cell: (row: PaymentRequest) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="h-8 w-8 p-0 text-gray-500 hover:text-gray-800"
          >
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => alert(`Viewing ${row.id}`)}>
            View Details
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => alert(`Editing ${row.id}`)}>
            Edit Request
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => alert(`Rejecting ${row.id}`)}>
            Reject
          </DropdownMenuItem>
          <DropdownMenuItem
            className="text-red-600"
            onClick={() => alert(`Deleting ${row.id}`)}
          >
            Delete Request
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];
