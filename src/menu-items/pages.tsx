// third-party
import { FormattedMessage } from 'react-intl';

// assets
import {
  ApiOutlined,
  CustomerServiceOutlined,
  LockOutlined,
  PhoneOutlined,
  RobotOutlined,
  RocketOutlined,
  UserOutlined
} from '@ant-design/icons';

// type
import { NavItemType } from 'types/menu';

// icons
const icons = { PhoneOutlined, RocketOutlined };

// ==============================|| MENU ITEMS - PAGES ||============================== //

const pages: NavItemType = {
  id: 'group-admin',
  title: 'Admin',
  type: 'group',
  children: [
    // {
    //   id: 'maintenance',
    //   title: <FormattedMessage id="maintenance" />,
    //   type: 'collapse',
    //   icon: icons.RocketOutlined,
    //   children: [
    //     {
    //       id: 'error-404',
    //       title: <FormattedMessage id="error-404" />,
    //       type: 'item',
    //       url: '/pages/404',
    //       target: true
    //     },
    //     {
    //       id: 'error-500',
    //       title: <FormattedMessage id="error-500" />,
    //       type: 'item',
    //       url: '/pages/500',
    //       target: true
    //     },
    //     {
    //       id: 'coming-soon',
    //       title: <FormattedMessage id="coming-soon" />,
    //       type: 'item',
    //       url: '/pages/coming-soon',
    //       target: true
    //     },
    //     {
    //       id: 'under-construction',
    //       title: <FormattedMessage id="under-construction" />,
    //       type: 'item',
    //       url: '/pages/under-construction',
    //       target: true
    //     }
    //   ]
    // },
    {
      id: 'services',
      title: 'Services',
      type: 'item',
      url: '/services',
      icon: ApiOutlined
    },
    {
      id: 'accounts',
      title: 'Accounts',
      type: 'item',
      url: '/accounts',
      icon: UserOutlined
    },
    {
      id: 'roles',
      title: 'Roles',
      type: 'item',
      url: '/roles',
      icon: RobotOutlined
    },
    {
      id: 'permissions',
      title: 'Permissions',
      type: 'item',
      url: '/permissions',
      icon: LockOutlined
    }
  ]
};

export default pages;
