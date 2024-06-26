import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { Menu } from 'antd';
import { AuthContext } from 'context/AuthProvider';
import {
  HOME_PAGE,
  LISTING_POSTS_PAGE,
  PRICING_PLAN_PAGE,
  AGENT_ACCOUNT_SETTINGS_PAGE,
} from 'settings/constant';

const MobileMenu = ({ className }) => {
  // auth context
  const { isLoggedIn, logOut } = useContext(AuthContext);

  const navigations = [
    {
      label: <NavLink to={HOME_PAGE}>Products</NavLink>,
      key: 'hotels',
    },
    {
      label: <NavLink to={`${LISTING_POSTS_PAGE}`}>Listing</NavLink>,
      key: 'listing',
    },
    {
      label: <NavLink to={`${PRICING_PLAN_PAGE}`}>Pricing</NavLink>,
      key: 'pricing',
    },
    {
      label: isLoggedIn && (
        <NavLink to={`${AGENT_ACCOUNT_SETTINGS_PAGE}`}>
          Account Settings
        </NavLink>
      ),
      key: 'account_settings',
    },
    {
      label: isLoggedIn && <button onClick={logOut}>Log Out</button>,
      key: 'logout',
    },
  ];

  return <Menu className={className} items={navigations} />;
};

export default MobileMenu;
