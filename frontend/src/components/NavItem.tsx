import { NavLink } from 'react-router-dom';

// @ts-ignore
import Services from '../assets/svg/services.svg?component';
// @ts-ignore
import Seller from '../assets/svg/seller.svg?component';
// @ts-ignore
import Buyer from '../assets/svg/buyer.svg?component';
// @ts-ignore
import Profile from '../assets/svg/profile.svg?component';
// @ts-ignore
import Escrows from '../assets/svg/escrow.svg?component';

import InitiateEscrow from '../pages/InitiateEscrow';
import RegisterSeller from '../pages/RegisterSeller';
import RegisterBuyer from '../pages/RegisterBuyer';

function NavItem({ to, label }: { to: string; label: string }) {
  let IconComponent;

  switch (to) {
    case '/services':
      IconComponent = Services;
      break;
    case '/sellers':
      IconComponent = Seller;
      break;
    case '/sellers/create':
      IconComponent = RegisterSeller;
      break;
    case '/buyers':
      IconComponent = Buyer;
      break;
    case '/buyers/create':
      IconComponent = RegisterBuyer;
      break;
    case '/escrows':
      IconComponent = Escrows;
      break;
    case '/escrows/create':
      IconComponent = InitiateEscrow;
      break;
    case '/profile':
      IconComponent = Profile;
      break;
    default:
      IconComponent = <div></div>;
      break;
  }

  const regularCls =
    'pl-4 py-2 text-gray-700 hover:text-indigo-700 transition w-full cursor-pointer text-[16px]';

  const activeCls =
    'pl-4 py-2 text-indigo-700 hover:text-indigo-700 transition w-full cursor-pointer font-semibold text-[16px]';

  return (
    <NavLink
      to={to}
      className={(props) => {
        return !props.isActive ? regularCls : activeCls;
      }}
    >
      <div className='flex items-center justify-start'>
        <div className='w-1/6 flex items-center justify-center'>
          <IconComponent />
        </div>
        <span className='ml-2 flex-1'>{label}</span>
      </div>
    </NavLink>
  );
}

export default NavItem;
