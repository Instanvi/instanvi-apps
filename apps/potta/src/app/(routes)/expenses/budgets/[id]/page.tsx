'use client';
import { ContextData } from '@potta/components/context';
import { usePathname } from 'next/navigation';
import { FC, useContext, useEffect } from 'react';

import RootLayout from '../../../layout';
import Filter from '../../components/filters';
import SingleBudget from './components/data';
import BudgetTable from './components/table';

const PayoutBudgetDetails: FC = () => {
  const context = useContext(ContextData);
  const pathname = usePathname();
  const string = pathname;
  const res = string.split('/');
  const id = res[3];

  useEffect(() => {
    context?.setLinks(res[2]);
  }, [id, context?.terminals]);

  return (
    <RootLayout>
      <div className="pl-16 pr-5 mt-10">
        <SingleBudget />
        {/* filter */}
        <Filter />
        {/*  Table */}
        <BudgetTable />
      </div>
    </RootLayout>
  );
};

export default PayoutBudgetDetails;
