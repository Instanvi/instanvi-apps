/* eslint-disable @next/next/no-img-element */
'use client';

import { usePathname } from 'next/navigation';
import SmallSideMenuItem from './sideMenuItem';
import { LargeSideMenuItem } from './sideMenuItem';
import { Dialog, Transition } from '@headlessui/react';
import { ContextData } from '@potta/components/context';
import React, { FC, Fragment, useContext, useEffect } from 'react';

interface Link {
  text: string;
  icon: string;
  href: string;
}

const SideMenu: FC = () => {
  const context = useContext(ContextData);
  const pathname = usePathname(); // Use usePathname

  useEffect(() => {
    const res: string[] = pathname.split('/');
    const pageName: string = res[2] === undefined ? 'dashboard' : res[2];
    context?.setLinks(pageName);
  }, [pathname, context]);

  const links: Link[] = [
    { text: 'dashboard', icon: 'ri-contrast-fill', href: '/dashboard/' },
    { text: 'terminals', icon: 'ri-user-6-fill', href: '/dashboard/terminals' },
    {
      text: 'collections',
      icon: 'ri-funds-box-line',
      href: '/dashboard/payouts',
    },
    {
      text: 'payouts',
      icon: 'ri-funds-box-line rotate-180 transform scale-x-[-1]',
      href: '/dashboard/payouts',
    },
    {
      text: 'accounts',
      icon: 'ri-pass-valid-line',
      href: '/dashboard/accounts',
    },
    {
      text: 'invoicing',
      icon: 'ri-file-list-2-line',
      href: '/dashboard/invoicing',
    },
    { text: 'cards', icon: 'ri-bank-card-line', href: '/dashboard/cards' },
    { text: 'vouchers', icon: 'ri-coupon-2-line', href: '/dashboard/vouchers' },
    { text: 'reports', icon: 'ri-bar-chart-line', href: '/dashboard/reports' },
  ];

  const adminLinks: Link[] = [
    { text: 'admin', icon: 'ri-bar-chart-line', href: '/dashboard/admin' },
    {
      text: 'settings',
      icon: 'ri-settings-3-line',
      href: '/dashboard/settings',
    },
  ];

  return (
    <aside className="hidden lg:fixed h-screen lg:flex lg:flex-col">
      <nav className="flex flex-col h-full overflow-x-hidden gap-y-5 overflow-y-auto border-r border-gray-200 bg-green-50 items-center pb-4 w-14">
        <div className="flex my-3 bg-white rounded-full h-10 w-10 justify-evenly items-center">
          <img src={`/images/pottaLogo.svg`} alt="" />
        </div>
        <ul role="list" className="flex flex-1 flex-col grow gap-6">
          {links.map((link, index) => (
            <SmallSideMenuItem
              key={index}
              href={link.href}
              icon={link.icon}
              active={context?.link === link.text}
              text={link.text}
            />
          ))}
          <div className="flex flex-col gap-6 mt-auto">
            {adminLinks.map((link, index) => (
              <SmallSideMenuItem
                key={index}
                href={link.href}
                icon={link.icon}
                active={context?.link === link.text}
                text={link.text}
              />
            ))}
          </div>
        </ul>
      </nav>

      <Transition.Root show={context?.sidebarOpen ?? false} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-20 lg:hidden"
          onClose={(value) => context?.setSidebarOpen(value)}
        >
          <Transition.Child
            as={Fragment}
            leaveTo="opacity-0"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leaveFrom="opacity-100"
            enter="transition-opacity ease-linear duration-300"
            leave="transition-opacity ease-linear duration-300"
          >
            <div className="fixed inset-0 bg-gray-900/80" />
          </Transition.Child>

          <div className="fixed inset-0 flex">
            <Transition.Child
              as={Fragment}
              enterTo="translate-x-0"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
              enterFrom="-translate-x-full"
              enter="transition ease-in-out duration-300 transform"
              leave="transition ease-in-out duration-300 transform"
            >
              <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                <Transition.Child
                  as={Fragment}
                  leaveTo="opacity-0"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leaveFrom="opacity-100"
                  enter="ease-in-out duration-300"
                  leave="ease-in-out duration-300"
                >
                  <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                    <button
                      type="button"
                      className="-m-2.5 p-2.5"
                      onClick={() => context?.setSidebarOpen(false)}
                    >
                      <span className="sr-only">Close sidebar</span>
                      <i className="ri-close-line text-2xl"></i>
                    </button>
                  </div>
                </Transition.Child>
                <div className="flex overflow-x-hidden grow flex-col gap-y-5 overflow-y-auto border-r w-full border-gray-200 bg-green-50 pb-4">
                  <div className="flex h-16 px-8 shrink-0 items-center">
                    <div className="flex mx-2 bg-white rounded-full h-10 w-10 justify-evenly items-center">
                      <img src={`/images/pottaLogo.svg`} alt="logo" />
                    </div>
                  </div>
                  <nav className="flex flex-1 flex-col">
                    <ul role="list" className="flex flex-1 flex-col">
                      <li className="flex flex-col grow">
                        <ul role="list" className="space-y-1">
                          {links.map((link, index) => (
                            <LargeSideMenuItem
                              key={index}
                              text={link.text}
                              href={link.href}
                              icon={link.icon}
                              active={context?.link === link.text}
                            />
                          ))}
                        </ul>
                      </li>
                      <div className="flex flex-col">
                        {adminLinks.map((link, index) => (
                          <LargeSideMenuItem
                            key={index}
                            active={false}
                            text={link.text}
                            href={link.href}
                            icon={link.icon}
                          />
                        ))}
                      </div>
                    </ul>
                  </nav>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
    </aside>
  );
};

export default SideMenu;
