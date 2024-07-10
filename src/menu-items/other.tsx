// third-party
import { FormattedMessage } from 'react-intl';

// assets
import { EditOutlined, QuestionOutlined, StopOutlined } from '@ant-design/icons';

// type
import { NavItemType } from 'types/menu';

// icons
const icons = {
  QuestionOutlined,
  StopOutlined
};

// ==============================|| MENU ITEMS - SUPPORT ||============================== //

const other: NavItemType = {
  id: 'user',
  title: 'User',
  type: 'group',
  children: [
    {
      id: 'user-account',
      title: 'Account',
      type: 'item',
      url: '/account',
      icon: EditOutlined
    }
    // {
    //   id: 'documentation',
    //   title: <FormattedMessage id="documentation" />,
    //   type: 'item',
    //   url: 'https://codedthemes.gitbook.io/mantis/',
    //   icon: icons.QuestionOutlined,
    //   external: true,
    //   target: true,
    //   chip: {
    //     label: 'gitbook',
    //     color: 'secondary',
    //     size: 'small'
    //   }
    // }
  ]
};

export default other;
