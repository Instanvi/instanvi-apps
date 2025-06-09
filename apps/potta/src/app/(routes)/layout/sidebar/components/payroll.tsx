/* eslint-disable @next/next/no-img-element */
import { useContext } from 'react';
import { Heart } from 'lucide-react';
import { usePathname } from 'next/navigation';
import Icon from '@potta/components/icon_fonts/icon';
import { ContextData } from '@potta/components/context';
import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import { svgIcons } from '@potta/components/svg_icons/IconsSvg';

const SidebarsPayroll = () => {
  const pathname = usePathname();

  const str = pathname.split('/');
  const context = useContext(ContextData);

  return (
    <Sidebar
      width="200px"
      toggled={true}
      breakPoint="md"
      collapsedWidth="65px"
      transitionDuration={500}
      collapsed={context?.toggle}
      className=" relative bg-blue-500  h-[100vh] z-30  side "
    >
      <Menu className="relative h-[76vh]" closeOnClick>
        <MenuItem
          href="/"
          className="mt-4 font-normal"
          icon={
            <img src="/icons/Potta.svg" className="h-16 w-16 mt-2" alt="logo" />
          }
        >
          {' '}
        </MenuItem>

        <MenuItem
          href="/payroll/overview"
          className="mt-8   font-normal"
          active={str[2] == 'overview' ? true : false}
          icon={svgIcons.dashboard(str[2] == 'overview' ? 'white' : 'black')}
        >
          {' '}
          <h3 className="text-md mt-[2px]">Dashboard</h3>{' '}
        </MenuItem>
        <MenuItem
          href="/payroll/people"
          className="mt-4 font-normal"
          active={str[2] == 'people' ? true : false}
          icon={svgIcons.users(str[2] == 'people' ? 'white' : 'black')}
        >
          <h3 className="text-md ">People</h3>
        </MenuItem>

        {/* Time Management with submenu */}
        <SubMenu
          active={str[2] == 'timesheet' ? true : false}
          label={<h3 className="text-md">Time Management</h3>}
          icon={svgIcons.clock(
            str[2] == 'timesheet' || str[2] == 'shifts' ? 'black' : 'black'
          )}
          className={`mt-4 font-normal ${
            str[2] == 'timesheet' || str[2] == 'shifts' ? 'active-submenu' : ''
          }`}
          defaultOpen={str[2] == 'timesheet' || str[2] == 'shifts'}
        >
          <MenuItem
            href="/payroll/timesheet"
            className="pl-6 font-normal"
            active={str[2] == 'timesheet' ? true : false}
          >
            <h3 className="text-md">Timesheet</h3>
          </MenuItem>
          <MenuItem
            href="/payroll/shifts"
            className="pl-6 font-normal"
            active={str[2] == 'shifts' ? true : false}
          >
            <h3 className="text-md">Shifts</h3>
          </MenuItem>
        </SubMenu>

        <MenuItem
          href="/payroll/benefit"
          className="mt-4 font-normal"
          active={str[2] == 'benefit' ? true : false}
          icon={
            <Heart size={21} color={str[2] == 'benefit' ? 'white' : 'black'} />
          }
        >
          <h3 className="text-md ">Benefit</h3>
        </MenuItem>

        <MenuItem
          href="/payroll/pto"
          className="mt-4 font-normal"
          active={str[2] == 'pto' ? true : false}
          icon={svgIcons.pto(str[2] == 'pto' ? 'white' : 'black')}
        >
          <h3 className="text-md ">PTO</h3>
        </MenuItem>
        <MenuItem
          href="/payroll/reports"
          className="mt-4 font-normal"
          active={str[2] == 'reports' ? true : false}
          icon={svgIcons.piechart(str[2] == 'reports' ? 'white' : 'black')}
        >
          <h3 className="text-md ">Reports</h3>
        </MenuItem>
      </Menu>
      <div className="absolute cursor-pointer mb-10 ml-6 bottom-0">
        <div className="flex-1 space-y-7 flex-col">
          <Icon
            size={23}
            icon="Menu-1"
            onClick={() => {
              context?.setToggle(!context?.toggle);
            }}
          />
          <div className="flex space-x-5">
            <img src="/icons/user.svg" className="h-10 w-10 -ml-2" alt="" />
            <p className="mt-2 text-md ml-3 font-normal">Jamison</p>
          </div>
        </div>
      </div>
    </Sidebar>
  );
};

export default SidebarsPayroll;
