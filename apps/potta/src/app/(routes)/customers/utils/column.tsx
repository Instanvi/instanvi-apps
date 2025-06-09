import TableActionPopover, {
  PopoverAction,
} from '@potta/components/tableActionsPopover';
import { PhoneFlag } from '../components/table';
import { UpdateCustomerPayload } from './validations';
import { Dispatch, SetStateAction } from 'react';

interface IColumnCustomer {
  setOpenViewModal: Dispatch<SetStateAction<string | null>>;
  setIsViewOpen: Dispatch<SetStateAction<boolean>>;
  setOpenUpdateModal: Dispatch<SetStateAction<string | null>>;
  setCustomerDetails: Dispatch<SetStateAction<UpdateCustomerPayload | null>>;
  setIsEditOpen: Dispatch<SetStateAction<boolean>>;
  setOpenDeleteModal: Dispatch<SetStateAction<string | null>>;
  setOpenPopover: Dispatch<SetStateAction<string | null>>;
  setIsDeleteOpen: Dispatch<SetStateAction<boolean>>;
  openPopover: string | null;
}
// interface IColumnCustomer {
//   setOpenViewModal: (data: string) => void;
//   setIsViewOpen: (data: boolean) => void;
//   setOpenUpdateModal: (data: string) => void;
//   setCustomerDetails: (data: string) => void;
//   setIsEditOpen: (data: boolean) => void;
//   setOpenDeleteModal: (data: string) => void;
//   setOpenPopover: (data: string) => void;
//   setIsDeleteOpen: (data: boolean) => void;
//   openPopover: string | null;
// }
export const customerColumns = ({
  setIsViewOpen,
  setOpenViewModal,
  setCustomerDetails,
  setOpenUpdateModal,
  setIsDeleteOpen,
  setIsEditOpen,
  setOpenDeleteModal,
  setOpenPopover,
  openPopover,
}: IColumnCustomer) => [
  {
    name: 'Customer Name',
    selector: (row: any) => (
      <div className="">
        {row.firstName} {row.lastName}
      </div>
    ),
  },
  {
    name: 'Telephone ',
    selector: (row: any) => <PhoneFlag phoneNumber={row.phone} />,
  },
  {
    name: 'Email',
    selector: (row: any) => <div className="">{row.email}</div>,
  },
  {
    name: 'Type',
    selector: (row: any) => <div>{row.type}</div>,
  },
  {
    name: 'Status',
    selector: (row: any) => {
      const status = row.status || 'enabled'; // Default to enabled if status is not provided

      // Status color mapping based on the specific status values from validations.ts
      const statusColorMap: Record<string, string> = {
        disabled: 'bg-red-100 text-red-800',
        expired: 'bg-gray-100 text-gray-800',
        schedule: 'bg-blue-100 text-blue-800',
        enabled: 'bg-green-100 text-green-800',
        taken: 'bg-purple-100 text-purple-800',
        available: 'bg-teal-100 text-teal-800',
        complete: 'bg-green-100 text-green-800',
        pending: 'bg-yellow-100 text-yellow-800',
      };

      const colorClass =
        statusColorMap[status.toLowerCase()] || 'bg-gray-100 text-gray-800'; // Default styling
      return (
        <div
          className={`px-3 py-1 rounded-full text-xs font-medium ${colorClass}`}
        >
          {status.charAt(0).toUpperCase() + status.slice(1)}{' '}
          {/* Capitalize first letter */}
        </div>
      );
    },
  },
  {
    name: 'Actions',
    selector: (row: any) => {
      const actions: PopoverAction[] = [
        {
          label: 'View',
          onClick: () => {
            setOpenViewModal(row.uuid);
            setIsViewOpen(true);
          },
          className: 'hover:bg-gray-200',
          icon: <i className="ri-eye-line" />,
        },
        {
          label: 'Edit',
          onClick: () => {
            setOpenUpdateModal(row.uuid);
            setCustomerDetails(row);
            setIsEditOpen(true);
          },
          className: 'hover:bg-gray-200',
          icon: <i className="ri-edit-line" />,
        },
        {
          label: 'Delete',
          onClick: () => {
            setOpenDeleteModal(row.uuid);
            setIsDeleteOpen(true);
          },
          className: 'hover:bg-red-200 text-red-600',
          icon: <i className="ri-delete-bin-line" />,
        },
      ];

      return (
        <TableActionPopover
          actions={actions}
          rowUuid={row.uuid}
          openPopover={openPopover}
          setOpenPopover={(data) => setOpenPopover(data as string)}
        />
      );
    },
  },
];
