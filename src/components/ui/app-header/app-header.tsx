import React, { FC } from 'react';
import styles from './app-header.module.css';
import { TAppHeaderUIProps } from './type';
import {
  BurgerIcon,
  ListIcon,
  Logo,
  ProfileIcon
} from '@zlden/react-developer-burger-ui-components';
import { NavLink } from 'react-router-dom';

export const AppHeaderUI: FC<TAppHeaderUIProps> = ({ userName }) => (
  <header className={styles.header}>
    <nav className={`${styles.menu} p-4`}>
      <div className={styles.menu_part_left}>
        <NavLink
          to='/'
          className={({ isActive }) =>
            `${styles.link} ${isActive ? styles.link_active : ''} mr-10`
          }
        >
          <BurgerIcon type='primary' />
          <p className='text text_type_main-default ml-2'>Конструктор</p>
        </NavLink>

        <NavLink
          to='/feed'
          className={({ isActive }) =>
            `${styles.link} ${isActive ? styles.link_active : ''}`
          }
        >
          <ListIcon type='primary' />
          <p className='text text_type_main-default ml-2'>Лента заказов</p>
        </NavLink>
      </div>

      <div className={styles.logo}>
        <NavLink to='/'>
          <Logo className={styles.logo} />
        </NavLink>
      </div>

      <div className={styles.link_position_last}>
        <NavLink
          to='/profile'
          className={({ isActive }) =>
            `${styles.link} ${isActive ? styles.link_active : ''}`
          }
        >
          <ProfileIcon type='primary' />
          <p className='text text_type_main-default ml-2'>
            {userName || 'Личный кабинет'}
          </p>
        </NavLink>
      </div>
    </nav>
  </header>
);
