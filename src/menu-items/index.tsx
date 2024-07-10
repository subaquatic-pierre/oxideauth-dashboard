// project import
import dashboard from './dashboard';
import other from './other';
import pages from './pages';

// types
import { NavItemType } from 'types/menu';

// ==============================|| MENU ITEMS ||============================== //

const menuItems: { items: NavItemType[] } = {
  items: [dashboard, pages, other]
};

export default menuItems;
