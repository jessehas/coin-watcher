import { useState } from 'react';
import { slide as Menu } from 'react-burger-menu';
import { Link } from 'react-router-dom';
import './css/SideMenu.css';

const SideMenu = ({ menuItems }) => {

  return (
    <Menu
      width={400}
    >
      {
        menuItems.map(menuItem => (
          <Link key={menuItem.id} to={`/${menuItem.id}`}>
            <img className="bm-item-image" src={menuItem.imageLink} alt={menuItem.label}/>{menuItem.label} ({menuItem.symbol})
          </Link>
        ))
      }
    </Menu>
  );
}

export default SideMenu;